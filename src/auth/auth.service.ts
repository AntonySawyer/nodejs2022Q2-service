import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { AuthError } from 'src/shared/error/AuthError';
import { LoginResponse, SignUpResponse } from './entities/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,

    private readonly jwtService: JwtService,
  ) {
    const { TOKEN_EXPIRE_TIME } = process.env;

    this.tokenExpiresInTime = TOKEN_EXPIRE_TIME;
  }

  private tokenExpiresInTime: string;

  private async createAccessToken(
    id: string,
    login: string,
  ): Promise<LoginResponse['accessToken']> {
    const tokenPayload = {
      id,
      login,
    };

    const token = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: this.tokenExpiresInTime,
    });

    return token;
  }

  async signup({ password, login }: SignUpDto): Promise<SignUpResponse> {
    try {
      await this.usersService.findOneBy('login', login);

      const newuser = await this.usersService.create({
        login,
        password,
      });

      return {
        id: newuser.id,
        message: 'User created',
      };
    } catch (error) {
      throw error;
    }
  }

  async login({ password, login }: LoginDto): Promise<LoginResponse> {
    try {
      const user = (await this.usersService.findOneBy(
        'login',
        login,
      )) as UserEntity;

      if (!user) {
        throw new AuthError('Such username not exist');
      }

      const { password: storedPassHash } = user;

      const isPasswordMatch = await bcrypt.compare(password, storedPassHash);

      if (!isPasswordMatch) {
        throw new AuthError('Incorrect password');
      }

      const accessToken = await this.createAccessToken(user.id, login);

      return {
        accessToken,
      };
    } catch (error) {
      throw error;
    }
  }
}
