import { AlbumEntity } from 'src/albums/entities/album.entity';
import { IAlbum } from 'src/albums/entities/album.interface';
import { ArtistEntity } from 'src/artists/entities/artist.entity';
import { IArtist } from 'src/artists/entities/artist.interface';
import { TrackEntity } from 'src/tracks/entities/track.entity';
import { ITrack } from 'src/tracks/entities/track.interface';

export interface IFav {
  id: string;
  artists: Array<IArtist['id']>;
  albums: Array<IAlbum['id']>;
  tracks: Array<ITrack['id']>;
}

export interface IFavoritesRepsonse {
  artists: ArtistEntity[];
  albums: AlbumEntity[];
  tracks: TrackEntity[];
}

export type EntityType = 'album' | 'artist' | 'track';
