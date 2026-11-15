import { AuthService } from './auth.service';
import { RefreshDto, SignInDto, SignUpDto } from './dto/auth.dto';
import { JwtUser } from './jwt-access.strategy';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
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
    refresh(dto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    logout(u: JwtUser, fcmToken?: string): Promise<void>;
}
