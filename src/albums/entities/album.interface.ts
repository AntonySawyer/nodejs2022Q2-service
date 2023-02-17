import { IArtist } from 'src/artists/entities/artist.interface';
import { EntityWithId } from 'src/shared/db/db.interface';

export interface IAlbum extends EntityWithId {
  id: string;
  name: string;
  year: number;
  artistId: IArtist['id'] | null;
}
