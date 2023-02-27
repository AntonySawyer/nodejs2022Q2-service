import { Column, Entity, PrimaryColumn } from 'typeorm';

import { IArtist } from './artist.interface';

@Entity()
export class ArtistEntity implements IArtist {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id: string;

  @Column('text')
  name: string;

  @Column('boolean', {
    default: false,
  })
  grammy: boolean;
}
