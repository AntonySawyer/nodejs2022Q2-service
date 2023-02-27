import { forwardRef, Module } from '@nestjs/common';

import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { FavsModule } from 'src/favs/favs.module';

@Module({
  controllers: [TracksController],
  providers: [TracksService],
  imports: [forwardRef(() => FavsModule)],
  exports: [TracksService],
})
export class TracksModule {}
