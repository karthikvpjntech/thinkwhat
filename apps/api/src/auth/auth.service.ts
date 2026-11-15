import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService, private cfg: ConfigService) {}

  async signUp(dto: SignUpDto) {
    if (await this.users.findByEmailWithSecrets(dto.email)) throw new ConflictException('Email already registered');
    const user = await this.users.create({
      email: dto.email.toLowerCase(), name: dto.name, passwordHash: await bcrypt.hash(dto.password, 12),
    });
    if (dto.fcmToken) await this.users.upsertDeviceToken(user.id, dto.fcmToken, dto.platform ?? 'android');
    return this.issueTokens(user.id, user.email);
  }

  async signIn(dto: SignInDto) {
    const user = await this.users.findByEmailWithSecrets(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash)))
      throw new UnauthorizedException('Invalid credentials');
    if (dto.fcmToken) await this.users.upsertDeviceToken(user.id, dto.fcmToken, dto.platform ?? 'android');
    return this.issueTokens(user.id, user.email);
  }

  /** Refresh-token rotation: each refresh invalidates the previous token. */
  async refresh(refreshToken: string) {
    let payload: { sub: string; email: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, { secret: this.cfg.get('JWT_REFRESH_SECRET') });
    } catch { throw new UnauthorizedException('Invalid refresh token'); }
    const user = await this.users.findByIdWithRefresh(payload.sub);
    if (!user?.refreshTokenHash || !(await bcrypt.compare(refreshToken.split('.')[2], user.refreshTokenHash))) {
      if (user) await this.users.setRefreshHash(user.id, null); // reuse detected → revoke
      throw new UnauthorizedException('Refresh token revoked');
    }
    return this.issueTokens(user.id, user.email);
  }

  async logout(userId: string, fcmToken?: string) {
    await this.users.setRefreshHash(userId, null);
    if (fcmToken) await this.users.removeDeviceToken(fcmToken);
  }

  private async issueTokens(sub: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync({ sub, email }, { secret: this.cfg.get('JWT_ACCESS_SECRET'), expiresIn: this.cfg.get('JWT_ACCESS_TTL', '15m') }),
      this.jwt.signAsync({ sub, email }, { secret: this.cfg.get('JWT_REFRESH_SECRET'), expiresIn: this.cfg.get('JWT_REFRESH_TTL', '30d') }),
    ]);
    // bcrypt only uses first 72 bytes; hash the JWT signature part to keep it unique
    await this.users.setRefreshHash(sub, await bcrypt.hash(refreshToken.split('.')[2], 10));
    return { accessToken, refreshToken, user: { id: sub, email } };
  }
}
