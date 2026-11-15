import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() fcmToken?: string;
  @IsOptional() @IsIn(['ios', 'android']) platform?: 'ios' | 'android';
}
export class SignInDto {
  @IsEmail() email: string;
  @IsString() password: string;
  @IsOptional() @IsString() fcmToken?: string;
  @IsOptional() @IsIn(['ios', 'android']) platform?: 'ios' | 'android';
}
export class RefreshDto { @IsString() refreshToken: string; }
