import { IArtist } from 'src/artists/entities/artist.interface';

export interface IAlbum {
  id: string;
  name: string;
  year: number;
  artistId: IArtist['id'] | null;
}
