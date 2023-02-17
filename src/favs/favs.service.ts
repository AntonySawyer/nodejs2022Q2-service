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
  FAV_TYPE,
  IFavIds,
  IFavIdsCollection,
  IFavoritesRepsonse,
} from './entities/fav.interface';
import { FavEntity } from './entities/fav.entity';

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
  }

  private storage: IGenericRepository<FavEntity>;

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

  async addEntity(entityType: FAV_TYPE, entityId: string) {
    try {
      await validateIsUUID(entityId);
    } catch (error) {
      throw error;
    }

    try {
      const entityService = this.getServiceByEntity(entityType);

      await entityService.findOne(entityId);
    } catch (error) {
      throw new UnprocessableError('Try other id');
    }

    try {
      const newEntity: FavEntity = {
        id: this.favId,
        type: entityType,
        entityId,
        artistId: entityType === FAV_TYPE.ARTIST ? entityId : null,
        albumId: entityType === FAV_TYPE.ALBUM ? entityId : null,
        trackId: entityType === FAV_TYPE.TRACK ? entityId : null,
      };

      await this.storage.create(newEntity);
    } catch (error) {
      throw error;
    }
  }

  async removeEntity(entityType: FAV_TYPE, entityId: string) {
    try {
      await validateIsUUID(entityId);

      await this.storage.removeBy({ entityId, type: entityType });
    } catch (error) {
      throw error;
    }
  }

  private getServiceByEntity(entityType: FAV_TYPE) {
    switch (entityType) {
      case FAV_TYPE.ARTIST:
        return this.artistService;

      case FAV_TYPE.ALBUM:
        return this.albumService;

      case FAV_TYPE.TRACK:
        return this.trackService;

      default:
        break;
    }
  }

  private async getCommonFavs() {
    const favsCollection: IFavIdsCollection = await this.storage.findManyByIds([
      this.favId,
    ]);

    const favsIds: IFavIds = {
      artistIds: [],
      albumIds: [],
      trackIds: [],
    };

    favsCollection.forEach((entity) => {
      switch (entity.type) {
        case FAV_TYPE.ARTIST:
          favsIds.artistIds.push(entity.entityId);
          break;
        case FAV_TYPE.ALBUM:
          favsIds.albumIds.push(entity.entityId);
          break;
        case FAV_TYPE.TRACK:
          favsIds.trackIds.push(entity.entityId);
          break;
        default:
          break;
      }
    });

    return favsIds;
  }
}
