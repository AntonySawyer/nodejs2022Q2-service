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
  IFavEntityEager,
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
      const favsCollection: IFavEntityEager[] =
        (await this.storage.findManyByIds([
          this.favId,
        ])) as unknown as IFavEntityEager[];

      const favorites: IFavoritesRepsonse = {
        artists: [],
        albums: [],
        tracks: [],
      };

      favsCollection.forEach((fav) => {
        switch (fav.type) {
          case FAV_TYPE.ARTIST:
            favorites.artists.push(fav.artist);
            break;
          case FAV_TYPE.ALBUM:
            favorites.albums.push(fav.album);
            break;
          case FAV_TYPE.TRACK:
            favorites.tracks.push(fav.track);
            break;
          default:
            break;
        }
      });

      return favorites;
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
        artist: entityType === FAV_TYPE.ARTIST ? entityId : null,
        album: entityType === FAV_TYPE.ALBUM ? entityId : null,
        track: entityType === FAV_TYPE.TRACK ? entityId : null,
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
}
