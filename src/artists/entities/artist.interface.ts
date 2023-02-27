import { EntityWithId } from 'src/shared/db/db.interface';

export interface IArtist extends EntityWithId {
  id: string;
  name: string;
  grammy: boolean;
}
