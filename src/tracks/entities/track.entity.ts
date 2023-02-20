import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { AlbumEntity } from '../../albums/entities/album.entity';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { ITrack } from './track.interface';

@Entity()
export class TrackEntity implements ITrack {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column('uuid', { nullable: true })
  @ManyToOne(() => ArtistEntity, (artist) => artist.id, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'artistId', referencedColumnName: 'id' })
  artistId: string | null;

  @Column('uuid', { nullable: true })
  @ManyToOne(() => AlbumEntity, (album) => album.id, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'albumId', referencedColumnName: 'id' })
  albumId: string | null;

  @Column('int')
  duration: number;
}
