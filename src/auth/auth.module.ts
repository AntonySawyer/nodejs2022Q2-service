import { Module } from '@nestjs/common';

import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

const { JWT_SECRET_KEY } = process.env;

@Module({
  imports: [UsersModule, JwtModule.register({ secret: JWT_SECRET_KEY })],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
