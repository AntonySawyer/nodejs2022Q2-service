import { forwardRef, Module } from '@nestjs/common';

import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { TracksModule } from 'src/tracks/tracks.module';
import { FavsModule } from 'src/favs/favs.module';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService],
  imports: [forwardRef(() => TracksModule), forwardRef(() => FavsModule)],
  exports: [ArtistsService],
})
export class ArtistsModule {}
