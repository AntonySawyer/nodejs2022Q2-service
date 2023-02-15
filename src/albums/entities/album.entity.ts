import { Column, Entity, PrimaryColumn } from 'typeorm';

import { IAlbum } from './album.interface';

@Entity()
export class AlbumEntity implements IAlbum {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column('text')
  name: string;

  @Column('int')
  year: number;

  @Column({ nullable: true })
  artistId: string | null;
}
