import { AlbumEntity } from 'src/albums/entities/album.entity';
import { ArtistEntity } from 'src/artists/entities/artist.entity';
import { EntityWithId } from 'src/shared/db/db.interface';
import { TrackEntity } from 'src/tracks/entities/track.entity';

export enum FAV_TYPE {
  ARTIST = 'artist',
  ALBUM = 'album',
  TRACK = 'track',
}

export interface IFavEntity {
  id: string;
  type: FAV_TYPE;
  entityId: EntityWithId['id'];
}

export type IFavEntityEager = {
  id: string;
} & (
  | {
      type: FAV_TYPE.ARTIST;
      artist: ArtistEntity;
    }
  | {
      type: FAV_TYPE.ALBUM;
      album: AlbumEntity;
    }
  | {
      type: FAV_TYPE.TRACK;
      track: TrackEntity;
    }
);

export interface IFavoritesRepsonse {
  artists: ArtistEntity[];
  albums: AlbumEntity[];
  tracks: TrackEntity[];
}
