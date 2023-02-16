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
import {
  IFavIdsCollection,
  IFavoritesRepsonse,
} from './entities/fav.interface';
import {
  FavAlbumEntity,
  FavArtistEntity,
  FavTrackEntity,
} from './entities/fav.entity';

@Injectable()
export class FavsService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private trackService: TracksService,

    @Inject(forwardRef(() => AlbumsService))
    private albumService: AlbumsService,

    @Inject(forwardRef(() => ArtistsService))
    private artistService: ArtistsService,

    @InjectRepository(FavArtistEntity)
    private repositoryArtist: Repository<FavArtistEntity>,

    @InjectRepository(FavAlbumEntity)
    private repositoryAlbum: Repository<FavAlbumEntity>,

    @InjectRepository(FavTrackEntity)
    private repositoryTrack: Repository<FavTrackEntity>,
  ) {
    const USER_ID = 'common-id-for-each-user-by-requirements';

    this.favId = USER_ID;
    this.artistStorage = new GenericRepository<FavArtistEntity>(
      this.repositoryArtist,
    );
    this.albumStorage = new GenericRepository<FavAlbumEntity>(
      this.repositoryAlbum,
    );
    this.trackStorage = new GenericRepository<FavTrackEntity>(
      this.repositoryTrack,
    );
  }

  private artistStorage: IGenericRepository<FavArtistEntity>;
  private albumStorage: IGenericRepository<FavAlbumEntity>;
  private trackStorage: IGenericRepository<FavTrackEntity>;

  private favId: string;

  async findAll() {
    try {
      const favs = await this.getCommonFavs();

      const result: IFavoritesRepsonse = {
        albums: await this.albumService.findManyByIds(favs.albumIds),
        artists: await this.artistService.findManyByIds(favs.artistIds),
        tracks: await this.trackService.findManyByIds(favs.trackIds),
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
      await this.trackStorage.create({
        id: this.favId,
        entityId: id,
      });
    } catch (error) {
      throw error;
    }
  }

  async removeTrack(id: string) {
    try {
      await validateIsUUID(id);

      await this.trackStorage.removeBy('entityId', id);
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
      await this.albumStorage.create({
        id: this.favId,
        entityId: id,
      });
    } catch (error) {
      throw error;
    }
  }

  async removeAlbum(id: string) {
    try {
      await validateIsUUID(id);

      await this.albumStorage.removeBy('entityId', id);
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
      await this.artistStorage.create({
        id: this.favId,
        entityId: id,
      });
    } catch (error) {
      throw error;
    }
  }

  async removeArtist(id: string) {
    try {
      await validateIsUUID(id);

      await this.artistStorage.removeBy('entityId', id);
    } catch (error) {
      throw error;
    }
  }

  private async getCommonFavs() {
    const favs: IFavIdsCollection = {
      artistIds: (await this.artistStorage.findManyByIds([this.favId])).map(
        (el) => el.entityId,
      ),
      albumIds: (await this.albumStorage.findManyByIds([this.favId])).map(
        (el) => el.entityId,
      ),
      trackIds: (await this.trackStorage.findManyByIds([this.favId])).map(
        (el) => el.entityId,
      ),
    };

    return favs;
  }
}
