import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtUser { userId: string; email: string; }

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(cfg: ConfigService) {
    super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: cfg.getOrThrow('JWT_ACCESS_SECRET') });
  }
  validate(p: { sub: string; email: string }): JwtUser { return { userId: p.sub, email: p.email }; }
}
