import { Column, Entity, PrimaryColumn } from 'typeorm';

import { IFavAlbum, IFavArtist, IFavTrack } from './fav.interface';
import { ArtistEntity } from 'src/artists/entities/artist.entity';
import { AlbumEntity } from 'src/albums/entities/album.entity';
import { TrackEntity } from 'src/tracks/entities/track.entity';

@Entity()
export class FavArtistEntity implements IFavArtist {
  @PrimaryColumn()
  id: string;

  @Column('uuid', {
    nullable: false,
  })
  entityId: ArtistEntity['id'];
}

@Entity()
export class FavAlbumEntity implements IFavAlbum {
  @PrimaryColumn()
  id: string;

  @Column('uuid', {
    nullable: false,
  })
  entityId: AlbumEntity['id'];
}

@Entity()
export class FavTrackEntity implements IFavTrack {
  @PrimaryColumn()
  id: string;

  @Column('uuid', {
    nullable: false,
  })
  entityId: TrackEntity['id'];
}
