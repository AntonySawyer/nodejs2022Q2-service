import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenEntity } from './entities/token.entity';

const { JWT_SECRET_KEY } = process.env;

@Module({
  imports: [
    UsersModule,
    JwtModule.register({ secret: JWT_SECRET_KEY }),
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
