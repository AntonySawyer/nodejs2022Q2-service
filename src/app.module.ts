import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { FavsModule } from './favs/favs.module';
import { UserEntity } from './users/entities/user.entity';
import { ArtistEntity } from './artists/entities/artist.entity';
import { AlbumEntity } from './albums/entities/album.entity';
import { TrackEntity } from './tracks/entities/track.entity';
import { FavEntity } from './favs/entities/fav.entity';

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_HOST,
      port: Number(POSTGRES_PORT),
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      entities: [UserEntity, ArtistEntity, AlbumEntity, TrackEntity, FavEntity],
      synchronize: true,
    }),
    UsersModule,
    TracksModule,
    AlbumsModule,
    ArtistsModule,
    FavsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
