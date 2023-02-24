import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { FavsModule } from './favs/favs.module';
import { ORM_OPTIONS } from './shared/db/ormConfig';
import { AppLoggerModule } from './shared/utils/logger/appLogger.module';
import { AllExceptionFilter } from './shared/filters/all-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot(ORM_OPTIONS),
    UsersModule,
    TracksModule,
    AlbumsModule,
    ArtistsModule,
    FavsModule,
    AppLoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
