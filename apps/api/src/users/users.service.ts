import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { DeviceToken } from './device-token.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(DeviceToken) private tokens: Repository<DeviceToken>,
  ) {}

  findByEmailWithSecrets(email: string) {
    return this.users.createQueryBuilder('u')
      .addSelect(['u.passwordHash', 'u.refreshTokenHash'])
      .where('LOWER(u.email) = LOWER(:email)', { email }).getOne();
  }
  findByIdWithRefresh(id: string) {
    return this.users.createQueryBuilder('u').addSelect('u.refreshTokenHash').where('u.id = :id', { id }).getOne();
  }
  create(data: Partial<User>) { return this.users.save(this.users.create(data)); }
  setRefreshHash(id: string, hash: string | null) { return this.users.update(id, { refreshTokenHash: hash }); }

  /** Upsert: a token moves to whoever logged in last on that device. */
  async upsertDeviceToken(userId: string, token: string, platform: 'ios' | 'android') {
    await this.tokens.upsert({ userId, token, platform }, ['token']);
  }
  getDeviceTokens(userId: string) { return this.tokens.find({ where: { userId } }); }
  removeDeviceToken(token: string) { return this.tokens.delete({ token }); }
}
