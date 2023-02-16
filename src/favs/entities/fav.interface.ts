import { AlbumEntity } from 'src/albums/entities/album.entity';
import { ArtistEntity } from 'src/artists/entities/artist.entity';
import { EntityWithId } from 'src/shared/db/db.interface';
import { TrackEntity } from 'src/tracks/entities/track.entity';

interface IFavFactory<TOriginalEntity extends EntityWithId> {
  id: string;
  entityId: TOriginalEntity['id'];
}

export type IFavArtist = IFavFactory<ArtistEntity>;
export type IFavAlbum = IFavFactory<AlbumEntity>;
export type IFavTrack = IFavFactory<TrackEntity>;

export interface IFavIdsCollection {
  artistIds: IFavArtist['entityId'][];
  albumIds: IFavAlbum['entityId'][];
  trackIds: IFavTrack['entityId'][];
}

export interface IFavoritesRepsonse {
  artists: ArtistEntity[];
  albums: AlbumEntity[];
  tracks: TrackEntity[];
}

export type EntityType = 'album' | 'artist' | 'track';
