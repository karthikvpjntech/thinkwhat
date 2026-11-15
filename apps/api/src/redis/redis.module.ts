import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const RedisMock = require('ioredis-mock');

export const REDIS = Symbol('REDIS');

@Global()
@Module({
  providers: [{
    provide: REDIS,
    inject: [ConfigService],
    useFactory: (c: ConfigService) => {
      const isMock = c.get('MOCK_SERVICES') === 'true' || !c.get('REDIS_HOST');
      if (isMock) {
        return new RedisMock();
      }
      return new Redis({ host: c.get('REDIS_HOST'), port: +c.get('REDIS_PORT', 6379) });
    },
  }],
  exports: [REDIS],
})
export class RedisModule {}
