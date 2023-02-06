import { IAlbum } from 'src/albums/entities/album.interface';
import { IArtist } from 'src/artists/entities/artist.interface';
import { ITrack } from 'src/tracks/entities/track.interface';
import { IFav } from './fav.interface';

export class FavEntity implements IFav {
  artists: Array<IArtist['id']>;
  albums: Array<IAlbum['id']>;
  tracks: Array<ITrack['id']>;
}
