import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { AuthError } from 'src/shared/error/AuthError';
import { EntityWithId } from 'src/shared/db/db.interface';
import { LoginResponse } from './entities/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,

    private readonly jwtService: JwtService,
  ) {}

  private async createAccessToken(
    id: string,
    login: string,
  ): Promise<LoginResponse['accessToken']> {
    const token = await this.jwtService.signAsync({
      id,
      login,
    });

    return token;
  }

  async signup({ password, login }: SignUpDto): Promise<EntityWithId> {
    try {
      const user = (await this.usersService.findOneBy(
        'login',
        login,
      )) as UserEntity;

      if (user) {
        // TODO: are we need this check by current requirements? (check with tests)
        // throw new error
      }

      const newuser = await this.usersService.create({
        login,
        password,
      });

      return { id: newuser.id }; // TODO 'corresponding message'
    } catch (error) {
      throw error;
    }
  }

  // TODO: return - tokens
  async login({ password, login }: LoginDto): Promise<LoginResponse> {
    try {
      const user = (await this.usersService.findOneBy(
        'login',
        login,
      )) as UserEntity;

      if (!user) {
        // TODO status 403

        throw new AuthError('Such username not exist');
      }

      const { password: storedPassHash } = user;

      const isPasswordMatch = await bcrypt.compare(password, storedPassHash);

      if (!isPasswordMatch) {
        // TODO status 403
        throw new AuthError('Incorrect password');
      }

      const accessToken = await this.createAccessToken(user.id, login);

      return {
        accessToken,
      }; // TODO: tokens + expiration time
    } catch (error) {
      throw error;
    }
  }
}
