import { Column, Entity, PrimaryColumn } from 'typeorm';

import { IAlbum } from 'src/albums/entities/album.interface';
import { IArtist } from 'src/artists/entities/artist.interface';
import { ITrack } from 'src/tracks/entities/track.interface';
import { IFav } from './fav.interface';

@Entity()
export class FavEntity implements IFav {
  @PrimaryColumn()
  id: string;

  @Column('uuid', { array: true })
  artists: Array<IArtist['id']>;

  @Column('uuid', { array: true })
  albums: Array<IAlbum['id']>;

  @Column('uuid', { array: true })
  tracks: Array<ITrack['id']>;
}
