import { ITrack } from './track.interface';

export class TrackEntity implements ITrack {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}
