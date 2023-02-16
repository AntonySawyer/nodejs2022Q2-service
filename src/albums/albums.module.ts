import { forwardRef, Module } from '@nestjs/common';

import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { FavsModule } from 'src/favs/favs.module';
import { AlbumEntity } from './entities/album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService],
  imports: [
    forwardRef(() => FavsModule),
    TypeOrmModule.forFeature([AlbumEntity]),
  ],
  exports: [AlbumsService],
})
export class AlbumsModule {}
