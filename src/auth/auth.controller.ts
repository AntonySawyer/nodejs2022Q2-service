import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshTokenRequest } from './entities/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(StatusCodes.CREATED)
  @Post('signup')
  signup(@Body() newUser: SignUpDto) {
    return this.authService.signup(newUser);
  }

  @HttpCode(StatusCodes.OK)
  @Post('login')
  login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  @HttpCode(StatusCodes.OK)
  @Post('refresh')
  refresh(@Body() refreshToken: RefreshTokenRequest) {
    return this.authService.refresh(refreshToken);
  }
}
