import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

import { AlbumEntity } from 'src/albums/entities/album.entity';
import { ArtistEntity } from 'src/artists/entities/artist.entity';
import { ITrack } from './track.interface';

@Entity()
export class TrackEntity implements ITrack {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  @OneToOne(() => ArtistEntity, (artist) => artist.id)
  artistId: string | null;

  @Column({ nullable: true })
  @OneToOne(() => AlbumEntity, (album) => album.id)
  albumId: string | null;

  @Column('int')
  duration: number;
}
