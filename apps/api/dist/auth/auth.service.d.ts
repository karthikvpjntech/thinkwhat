import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
export declare class AuthService {
    private users;
    private jwt;
    private cfg;
    constructor(users: UsersService, jwt: JwtService, cfg: ConfigService);
    signUp(dto: SignUpDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    signIn(dto: SignInDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    logout(userId: string, fcmToken?: string): Promise<void>;
    private issueTokens;
}
