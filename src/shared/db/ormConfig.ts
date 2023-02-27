import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

import { AlbumEntity } from '../../albums/entities/album.entity';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { FavEntity } from '../../favs/entities/fav.entity';
import { TrackEntity } from '../../tracks/entities/track.entity';
import { UserEntity } from '../../users/entities/user.entity';
import Migrations from '../../../db/migrations';
import { TokenEntity } from 'src/auth/entities/token.entity';

config();

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  DB_FULL_LOG,
} = process.env;

const isDbFullLogEnabled = DB_FULL_LOG === 'true';

export const ORM_OPTIONS: TypeOrmModuleOptions = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [
    UserEntity,
    ArtistEntity,
    AlbumEntity,
    TrackEntity,
    FavEntity,
    TokenEntity,
  ],
  migrations: Migrations,
  migrationsRun: true,
  logging: isDbFullLogEnabled,
  logger: isDbFullLogEnabled ? 'advanced-console' : undefined,
};
