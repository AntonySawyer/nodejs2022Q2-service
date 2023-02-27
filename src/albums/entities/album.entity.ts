import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { ArtistEntity } from '../../artists/entities/artist.entity';
import { IAlbum } from './album.interface';

@Entity()
export class AlbumEntity implements IAlbum {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id: string;

  @Column('text')
  name: string;

  @Column('int')
  year: number;

  @Column('uuid', { nullable: true })
  @ManyToOne(() => ArtistEntity, (artist) => artist.id, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'artistId', referencedColumnName: 'id' })
  artistId: string | null;
}
