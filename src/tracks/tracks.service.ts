import { Injectable } from '@nestjs/common';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { isUUID } from 'class-validator';
import { v4 as uuidV4 } from 'uuid';

import { IGenericRepository } from 'src/shared/db/db.interface';
import { GenericRepository } from 'src/shared/db/genericRepository';
import { BadRequestError } from 'src/shared/error';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from './entities/track.entity';
import { ITrack } from './entities/track.interface';

@Injectable()
export class TracksService {
  constructor() {
    this.storage = new GenericRepository<TrackEntity>();
  }

  private storage: IGenericRepository<TrackEntity>;

  async create(createTrackDto: CreateTrackDto): Promise<TrackEntity> {
    const newId = uuidV4();
    const newInstance = plainToClass(TrackEntity, {
      id: newId,
      ...createTrackDto,
    });

    const createdInstance = await this.storage.create(newId, newInstance);

    const plainCreatedEntity = instanceToPlain(createdInstance) as ITrack;

    return plainCreatedEntity;
  }

  async findAll(): Promise<TrackEntity[]> {
    const instances = await this.storage.find();

    const plainEntities: ITrack[] = instances.map(
      (instance) => instanceToPlain(instance) as ITrack,
    );

    return plainEntities;
  }

  async findOne(id: string): Promise<TrackEntity> {
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
    updateTrackDto: UpdateTrackDto,
  ): Promise<TrackEntity> {
    try {
      const isIdValid = isUUID(id, '4');

      if (!isIdValid) {
        throw new BadRequestError('Incorrect format of id');
      }

      const originalEntity = await this.storage.findById(id);

      const updatedEntityInstance = plainToClass(
        UpdateTrackDto,
        updateTrackDto,
      );

      const entityForUpdate: TrackEntity = {
        ...originalEntity,
        ...updatedEntityInstance,
      };

      const updatedEntityDbResponse = await this.storage.updateById(
        id,
        entityForUpdate,
      );

      const plainUpdatedEntity = instanceToPlain(
        updatedEntityDbResponse,
      ) as ITrack;

      return plainUpdatedEntity;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
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
