import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { UsersService } from '../users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { AuthError } from 'src/shared/error/AuthError';
import { LoginResponse, SignUpResponse } from './entities/auth.interface';
import { IGenericRepository } from 'src/shared/db/db.interface';
import { GenericRepository } from 'src/shared/db/genericRepository';
import { TokenEntity } from './entities/token.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,

    private readonly jwtService: JwtService,

    @InjectRepository(TokenEntity)
    private repository: Repository<TokenEntity>,
  ) {
    const { TOKEN_EXPIRE_TIME, TOKEN_REFRESH_EXPIRE_TIME } = process.env;

    this.tokenExpiresInTime = TOKEN_EXPIRE_TIME;
    this.refreshTokenExpiresInTime = TOKEN_REFRESH_EXPIRE_TIME;

    this.storage = new GenericRepository<TokenEntity>(this.repository);
  }

  private storage: IGenericRepository<TokenEntity>;

  private tokenExpiresInTime: string;

  private refreshTokenExpiresInTime: string;

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

  private async createRefreshToken(
    accessToken: string,
  ): Promise<LoginResponse['refreshToken']> {
    const token = await this.jwtService.signAsync(
      { accessToken },
      {
        expiresIn: this.refreshTokenExpiresInTime,
      },
    );

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
      const refreshToken = await this.createRefreshToken(accessToken);

      const tokenEntity = plainToClass(TokenEntity, {
        id: user.id,
        accessToken,
        refreshToken,
      });

      await this.storage.create(tokenEntity);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }
}
