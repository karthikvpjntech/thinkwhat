import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshDto, SignInDto, SignUpDto } from './dto/auth.dto';
import { CurrentUser, JwtAuthGuard } from './jwt-auth.guard';
import { JwtUser } from './jwt-access.strategy';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup') signUp(@Body() dto: SignUpDto) { return this.auth.signUp(dto); }
  @Post('signin') @HttpCode(200) signIn(@Body() dto: SignInDto) { return this.auth.signIn(dto); }
  @Post('refresh') @HttpCode(200) refresh(@Body() dto: RefreshDto) { return this.auth.refresh(dto.refreshToken); }

  @Post('logout') @HttpCode(204) @UseGuards(JwtAuthGuard)
  logout(@CurrentUser() u: JwtUser, @Body('fcmToken') fcmToken?: string) { return this.auth.logout(u.userId, fcmToken); }
}
