import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { TracksModule } from 'src/tracks/tracks.module';
import { FavsModule } from 'src/favs/favs.module';
import { ArtistEntity } from './entities/artist.entity';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService],
  imports: [
    forwardRef(() => TracksModule),
    forwardRef(() => FavsModule),
    TypeOrmModule.forFeature([ArtistEntity]),
  ],
  exports: [ArtistsService],
})
export class ArtistsModule {}
