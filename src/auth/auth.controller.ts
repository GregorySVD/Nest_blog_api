import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST Sighup
  @Post('sighup') //auth/sighup
  async singUp(@Body() signupData: SignupDto) {
    return this.authService.signup(signupData);
  }
  //POST Login
  @Post('login') //auth/login
  async login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  //POST Refresh Token
  @Post('refresh') //auth/refresh
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshToken.refreshToken);
  }
}
