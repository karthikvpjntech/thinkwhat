import { User } from './user.entity';
export declare class DeviceToken {
    id: string;
    token: string;
    platform: 'ios' | 'android';
    userId: string;
    user: User;
    lastSeenAt: Date;
}
