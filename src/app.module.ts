import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { FavsModule } from './favs/favs.module';
import { ORM_OPTIONS } from './shared/db/ormConfig';
import { AppLoggerMiddleware } from './shared/utils/logger/appLogger.middleware';
import { AppLoggerModule } from './shared/utils/logger/appLogger.module';

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
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes({
      method: RequestMethod.ALL,
      path: '*',
    });
  }
}
