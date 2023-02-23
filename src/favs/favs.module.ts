import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { TracksModule } from 'src/tracks/tracks.module';
import { ArtistsModule } from 'src/artists/artists.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { FavEntity } from './entities/fav.entity';
import { AppLoggerModule } from 'src/shared/utils/logger/appLogger.module';

@Module({
  controllers: [FavsController],
  providers: [FavsService],
  imports: [
    forwardRef(() => ArtistsModule),
    forwardRef(() => TracksModule),
    forwardRef(() => AlbumsModule),
    TypeOrmModule.forFeature([FavEntity]),
    AppLoggerModule,
  ],
  exports: [FavsService],
})
export class FavsModule {}
