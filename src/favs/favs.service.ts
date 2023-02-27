import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { IGenericRepository } from 'src/shared/db/db.interface';
import { GenericRepository } from 'src/shared/db/genericRepository';
import { UnprocessableError } from 'src/shared/error/UnprocessableError';
import { validateIsUUID } from 'src/shared/utils/validateIsUUID';
import { TracksService } from 'src/tracks/tracks.service';
import { FavEntity } from './entities/fav.entity';
import { IFav, IFavoritesRepsonse } from './entities/fav.interface';

@Injectable()
export class FavsService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private trackService: TracksService,

    @Inject(forwardRef(() => AlbumsService))
    private albumService: AlbumsService,

    @Inject(forwardRef(() => ArtistsService))
    private artistService: ArtistsService,
  ) {
    const USER_ID = 'common-id-for-each-user-by-requirements';

    this.favId = USER_ID;
    this.storage = new GenericRepository<FavEntity>();

    this.storage.create(USER_ID, {
      albums: [],
      artists: [],
      tracks: [],
    });
  }

  private storage: IGenericRepository<FavEntity>;

  private favId: string;

  async findAll() {
    try {
      const result: IFavoritesRepsonse = {
        albums: [],
        artists: [],
        tracks: [],
      };

      const favs = await this.getCommonFavs();

      favs.albums.forEach(async (albumId) => {
        const album = await this.albumService.findOne(albumId);

        result.albums.push(album);
      });

      favs.artists.map(async (artistId) => {
        const artist = await this.artistService.findOne(artistId);

        result.artists.push(artist);
      });

      favs.tracks.map(async (trackId) => {
        const track = await this.trackService.findOne(trackId);

        result.tracks.push(track);
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async addTrack(id: string) {
    try {
      await validateIsUUID(id);
    } catch (error) {
      throw error;
    }

    try {
      await this.trackService.findOne(id);
    } catch (error) {
      throw new UnprocessableError('Try other id');
    }

    try {
      const originalFavs = await this.getCommonFavs();

      const updatedFavs: IFav = {
        ...originalFavs,
        tracks: [...originalFavs.tracks, id],
      };

      await this.storage.updateById(this.favId, updatedFavs);
    } catch (error) {
      throw error;
    }
  }

  async removeTrack(id: string) {
    try {
      await validateIsUUID(id);

      const originalFavs = await this.getCommonFavs();

      const updatedFavs: IFav = {
        ...originalFavs,
        tracks: originalFavs.tracks.filter((el) => el !== id),
      };

      await this.storage.updateById(this.favId, updatedFavs);
    } catch (error) {
      throw error;
    }
  }

  async addAlbum(id: string) {
    try {
      await validateIsUUID(id);
    } catch (error) {
      throw error;
    }

    try {
      await this.albumService.findOne(id);
    } catch (error) {
      throw new UnprocessableError('Try other id');
    }

    try {
      const originalFavs = await this.storage.findById(this.favId);
      const updatedFavs: IFav = {
        ...originalFavs,
        albums: [...originalFavs.albums, id],
      };

      await this.storage.updateById(this.favId, updatedFavs);
    } catch (error) {
      throw error;
    }
  }

  async removeAlbum(id: string) {
    try {
      await validateIsUUID(id);

      const originalFavs = await this.getCommonFavs();

      const updatedFavs: IFav = {
        ...originalFavs,
        albums: originalFavs.albums.filter((el) => el !== id),
      };

      await this.storage.updateById(this.favId, updatedFavs);
    } catch (error) {
      throw error;
    }
  }

  async addArtist(id: string) {
    try {
      await validateIsUUID(id);
    } catch (error) {
      throw error;
    }

    try {
      await this.artistService.findOne(id);
    } catch (error) {
      throw new UnprocessableError('Try other id');
    }

    try {
      const originalFavs = await this.getCommonFavs();

      const updatedFavs: IFav = {
        ...originalFavs,
        artists: [...originalFavs.artists, id],
      };

      await this.storage.updateById(this.favId, updatedFavs);
    } catch (error) {
      throw error;
    }
  }

  async removeArtist(id: string) {
    const originalFavs = await this.getCommonFavs();

    const updatedFavs: IFav = {
      ...originalFavs,
      artists: originalFavs.artists.filter((el) => el !== id),
    };

    await this.storage.updateById(this.favId, updatedFavs);
  }

  private async getCommonFavs() {
    const favs = await this.storage.findById(this.favId);

    return favs;
  }
}
