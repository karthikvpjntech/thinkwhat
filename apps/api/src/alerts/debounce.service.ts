import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS } from '../redis/redis.module';

@Injectable()
export class DebounceService {
  private ttl: number;
  constructor(@Inject(REDIS) private redis: Redis, cfg: ConfigService) {
    this.ttl = +cfg.get('ALERT_DEBOUNCE_SECONDS', 1800); // 30 min
  }
  private key(userId: string, shopId: string) { return `alert:debounce:${userId}:${shopId}`; }

  /** Atomic SET NX EX → true only for the first caller in the window. Race-safe across workers. */
  async acquire(userId: string, shopId: string): Promise<boolean> {
    return (await this.redis.set(this.key(userId, shopId), Date.now().toString(), 'EX', this.ttl, 'NX')) === 'OK';
  }
  /** Release if sending failed so a retry is allowed. */
  release(userId: string, shopId: string) { return this.redis.del(this.key(userId, shopId)); }
}
