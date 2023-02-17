import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { v4 as uuidV4 } from 'uuid';

import { IGenericRepository } from 'src/shared/db/db.interface';
import { GenericRepository } from 'src/shared/db/genericRepository';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from './entities/track.entity';
import { ITrack } from './entities/track.interface';
import { validateIsUUID } from 'src/shared/utils/validateIsUUID';
import { FavsService } from 'src/favs/favs.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { FAV_TYPE } from 'src/favs/entities/fav.interface';

@Injectable()
export class TracksService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,

    @InjectRepository(TrackEntity)
    private repository: Repository<TrackEntity>,
  ) {
    this.storage = new GenericRepository<TrackEntity>(this.repository);
  }

  private storage: IGenericRepository<TrackEntity>;

  async create(createTrackDto: CreateTrackDto): Promise<TrackEntity> {
    const newId = uuidV4();
    const newInstance = plainToClass(TrackEntity, {
      id: newId,
      ...createTrackDto,
    });

    const createdInstance = await this.storage.create(newInstance);

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
      await validateIsUUID(id);

      const entity = await this.storage.findById(id);

      return entity;
    } catch (error) {
      throw error;
    }
  }

  async findManyByIds(ids: string[]): Promise<TrackEntity[]> {
    const validatedIds = ids.filter((id) => isUUID(id));

    try {
      const entities = await this.storage.findManyByIds(validatedIds);

      return entities;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<TrackEntity> {
    try {
      await validateIsUUID(id);

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
      await validateIsUUID(id);

      await this.storage.removeById(id);

      await this.favsService.removeEntity(FAV_TYPE.TRACK, id);
    } catch (error) {
      throw error;
    }
  }
}
