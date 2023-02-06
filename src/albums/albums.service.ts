import { Injectable } from '@nestjs/common';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { v4 as uuidV4 } from 'uuid';

import { IGenericRepository } from 'src/shared/db/db.interface';
import { GenericRepository } from 'src/shared/db/genericRepository';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from './entities/album.entity';
import { IAlbum } from './entities/album.interface';
import { isUUID } from 'class-validator';
import { BadRequestError } from 'src/shared/error';

@Injectable()
export class AlbumsService {
  constructor() {
    this.storage = new GenericRepository<AlbumEntity>();
  }

  private storage: IGenericRepository<AlbumEntity>;

  async create(createAlbumDto: CreateAlbumDto): Promise<AlbumEntity> {
    const newId = uuidV4();
    const newInstance = plainToClass(AlbumEntity, {
      id: newId,
      ...createAlbumDto,
    });

    const createdInstance = await this.storage.create(newId, newInstance);

    const plainCreatedEntity = instanceToPlain(createdInstance) as IAlbum;

    return plainCreatedEntity;
  }

  async findAll(): Promise<AlbumEntity[]> {
    const instances = await this.storage.find();

    const plainEntities: IAlbum[] = instances.map(
      (instance) => instanceToPlain(instance) as IAlbum,
    );

    return plainEntities;
  }

  async findOne(id: string): Promise<AlbumEntity> {
    try {
      const isIdValid = isUUID(id, '4');

      if (!isIdValid) {
        throw new BadRequestError('Incorrect format of id');
      }

      const entity = await this.storage.findById(id);

      return entity;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumEntity> {
    try {
      const isIdValid = isUUID(id, '4');

      if (!isIdValid) {
        throw new BadRequestError('Incorrect format of id');
      }

      const originalEntity = await this.storage.findById(id);

      const updatedEntityInstance = plainToClass(
        UpdateAlbumDto,
        updateAlbumDto,
      );

      const entityForUpdate: AlbumEntity = {
        ...originalEntity,
        ...updatedEntityInstance,
      };

      const updatedEntityDbResponse = await this.storage.updateById(
        id,
        entityForUpdate,
      );

      const plainUpdatedEntity = instanceToPlain(
        updatedEntityDbResponse,
      ) as IAlbum;

      return plainUpdatedEntity;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const isIdValid = isUUID(id, '4');

      if (!isIdValid) {
        throw new BadRequestError('Incorrect format of id');
      }

      await this.storage.removeById(id);
    } catch (error) {
      throw error;
    }
  }
}
