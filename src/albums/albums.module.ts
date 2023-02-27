import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { AlbumEntity } from './entities/album.entity';
import { AppLoggerModule } from 'src/shared/utils/logger/appLogger.module';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService],
  imports: [TypeOrmModule.forFeature([AlbumEntity]), AppLoggerModule],
  exports: [AlbumsService],
})
export class AlbumsModule {}
