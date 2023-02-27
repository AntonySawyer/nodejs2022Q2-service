import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { TrackEntity } from './entities/track.entity';

@Module({
  controllers: [TracksController],
  providers: [TracksService],
  imports: [TypeOrmModule.forFeature([TrackEntity])],
  exports: [TracksService],
})
export class TracksModule {}
