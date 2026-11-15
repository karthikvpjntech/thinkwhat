import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
export interface JwtUser {
    userId: string;
    email: string;
}
declare const JwtAccessStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtAccessStrategy extends JwtAccessStrategy_base {
    constructor(cfg: ConfigService);
    validate(p: {
        sub: string;
        email: string;
    }): JwtUser;
}
export {};
