import { forwardRef, Module } from '@nestjs/common';

import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { TracksModule } from 'src/tracks/tracks.module';
import { FavsModule } from 'src/favs/favs.module';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService],
  imports: [forwardRef(() => TracksModule), forwardRef(() => FavsModule)],
  exports: [AlbumsService],
})
export class AlbumsModule {}
