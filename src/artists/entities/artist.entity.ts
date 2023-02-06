import { IArtist } from './artist.interface';

export class ArtistEntity implements IArtist {
  id: string;
  name: string;
  grammy: boolean;
}
