import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

    @InjectRepository(FavEntity)
    private repository: Repository<FavEntity>,
  ) {
    const USER_ID = 'common-id-for-each-user-by-requirements';

    this.favId = USER_ID;
    this.storage = new GenericRepository<FavEntity>(this.repository);

    this.storage.create({
      id: USER_ID,
      albums: [],
      artists: [],
      tracks: [],
    });
  }

  private storage: IGenericRepository<FavEntity>;

  private favId: string;

  async findAll() {
    try {
      const favs = await this.getCommonFavs();

      const result: IFavoritesRepsonse = {
        albums: await this.albumService.findManyByIds(favs.albums),
        artists: await this.artistService.findManyByIds(favs.artists),
        tracks: await this.trackService.findManyByIds(favs.tracks),
      };

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
