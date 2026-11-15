import { Repository } from 'typeorm';
import { User } from './user.entity';
import { DeviceToken } from './device-token.entity';
export declare class UsersService {
    private users;
    private tokens;
    constructor(users: Repository<User>, tokens: Repository<DeviceToken>);
    findByEmailWithSecrets(email: string): Promise<User>;
    findByIdWithRefresh(id: string): Promise<User>;
    create(data: Partial<User>): Promise<User>;
    setRefreshHash(id: string, hash: string | null): Promise<import("typeorm").UpdateResult>;
    upsertDeviceToken(userId: string, token: string, platform: 'ios' | 'android'): Promise<void>;
    getDeviceTokens(userId: string): Promise<DeviceToken[]>;
    removeDeviceToken(token: string): Promise<import("typeorm").DeleteResult>;
}
