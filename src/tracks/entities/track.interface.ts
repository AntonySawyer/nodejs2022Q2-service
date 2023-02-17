import { EntityWithId } from 'src/shared/db/db.interface';

export interface ITrack extends EntityWithId {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}
