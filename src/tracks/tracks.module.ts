import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { TrackEntity } from './entities/track.entity';
import { AppLoggerModule } from 'src/shared/utils/logger/appLogger.module';

@Module({
  controllers: [TracksController],
  providers: [TracksService],
  imports: [TypeOrmModule.forFeature([TrackEntity]), AppLoggerModule],
  exports: [TracksService],
})
export class TracksModule {}
