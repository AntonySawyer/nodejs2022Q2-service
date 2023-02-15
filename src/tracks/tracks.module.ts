import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { FavsModule } from 'src/favs/favs.module';
import { TrackEntity } from './entities/track.entity';

@Module({
  controllers: [TracksController],
  providers: [TracksService],
  imports: [
    forwardRef(() => FavsModule),
    TypeOrmModule.forFeature([TrackEntity]),
  ],
  exports: [TracksService],
})
export class TracksModule {}
