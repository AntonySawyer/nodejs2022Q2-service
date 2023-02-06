import { IAlbum } from './album.interface';

export class AlbumEntity implements IAlbum {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}
