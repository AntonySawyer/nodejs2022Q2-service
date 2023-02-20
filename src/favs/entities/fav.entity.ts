import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { AlbumEntity } from '../../albums/entities/album.entity';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { EntityWithId } from '../../shared/db/db.interface';
import { TrackEntity } from '../../tracks/entities/track.entity';

import { FAV_TYPE, IFavEntity } from './fav.interface';

@Entity()
export class FavEntity implements IFavEntity {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'enum',
    enum: FAV_TYPE,
  })
  type: FAV_TYPE;

  @PrimaryColumn('uuid', {
    nullable: false,
  })
  entityId: EntityWithId['id'];

  @Column('uuid', { nullable: true })
  @ManyToOne(() => ArtistEntity, (artist) => artist.id, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'artistId', referencedColumnName: 'id' })
  artist: string | null;

  @Column('uuid', { nullable: true })
  @ManyToOne(() => AlbumEntity, (album) => album.id, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'albumId', referencedColumnName: 'id' })
  album: string | null;

  @Column('uuid', { nullable: true })
  @ManyToOne(() => TrackEntity, (track) => track.id, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'trackId', referencedColumnName: 'id' })
  track: string | null;
}
