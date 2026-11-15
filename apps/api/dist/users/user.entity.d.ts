import { DeviceToken } from './device-token.entity';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    name?: string;
    refreshTokenHash?: string | null;
    deviceTokens: DeviceToken[];
    createdAt: Date;
}
