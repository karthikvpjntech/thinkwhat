export declare class SignUpDto {
    email: string;
    password: string;
    name?: string;
    fcmToken?: string;
    platform?: 'ios' | 'android';
}
export declare class SignInDto {
    email: string;
    password: string;
    fcmToken?: string;
    platform?: 'ios' | 'android';
}
export declare class RefreshDto {
    refreshToken: string;
}
