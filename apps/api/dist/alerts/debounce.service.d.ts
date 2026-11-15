import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
export declare class DebounceService {
    private redis;
    private ttl;
    constructor(redis: Redis, cfg: ConfigService);
    private key;
    acquire(userId: string, shopId: string): Promise<boolean>;
    release(userId: string, shopId: string): Promise<number>;
}
