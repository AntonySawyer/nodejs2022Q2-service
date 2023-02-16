import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { TracksModule } from 'src/tracks/tracks.module';
import { ArtistsModule } from 'src/artists/artists.module';
import { AlbumsModule } from 'src/albums/albums.module';
import {
  FavAlbumEntity,
  FavArtistEntity,
  FavTrackEntity,
} from './entities/fav.entity';

@Module({
  controllers: [FavsController],
  providers: [FavsService],
  imports: [
    forwardRef(() => ArtistsModule),
    forwardRef(() => TracksModule),
    forwardRef(() => AlbumsModule),
    TypeOrmModule.forFeature([FavAlbumEntity, FavArtistEntity, FavTrackEntity]),
  ],
  exports: [FavsService],
})
export class FavsModule {}
