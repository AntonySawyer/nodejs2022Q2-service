import { Column, Entity, PrimaryColumn } from 'typeorm';

import { ITrack } from './track.interface';

@Entity()
export class TrackEntity implements ITrack {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  artistId: string | null;

  @Column({ nullable: true })
  albumId: string | null;

  @Column('int')
  duration: number;
}
