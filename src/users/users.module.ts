import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';
import { AppLoggerModule } from 'src/shared/utils/logger/appLogger.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AppLoggerModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
