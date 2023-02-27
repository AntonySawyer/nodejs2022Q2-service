import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { ArtistEntity } from './entities/artist.entity';
import { AppLoggerModule } from 'src/shared/utils/logger/appLogger.module';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService],
  imports: [TypeOrmModule.forFeature([ArtistEntity]), AppLoggerModule],
  exports: [ArtistsService],
})
export class ArtistsModule {}
