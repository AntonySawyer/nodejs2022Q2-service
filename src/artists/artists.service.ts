import { Injectable } from '@nestjs/common';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { v4 as uuidV4 } from 'uuid';

import { IGenericRepository } from 'src/shared/db/db.interface';
import { GenericRepository } from 'src/shared/db/genericRepository';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from './entities/artist.entity';
import { IArtist } from './entities/artist.interface';
import { validateIsUUID } from 'src/shared/utils/validateIsUUID';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(ArtistEntity)
    private repository: Repository<ArtistEntity>,
  ) {
    this.storage = new GenericRepository<ArtistEntity>(this.repository);
  }

  private storage: IGenericRepository<ArtistEntity>;

  async create(createArtistDto: CreateArtistDto): Promise<ArtistEntity> {
    const newId = uuidV4();
    const newInstance = plainToClass(ArtistEntity, {
      id: newId,
      ...createArtistDto,
    });

    const createdInstance = await this.storage.create(newInstance);

    const plainCreatedEntity = instanceToPlain(createdInstance) as IArtist;

    return plainCreatedEntity;
  }

  async findAll(): Promise<ArtistEntity[]> {
    const instances = await this.storage.find();

    const plainEntities: IArtist[] = instances.map(
      (instance) => instanceToPlain(instance) as IArtist,
    );

    return plainEntities;
  }

  async findOne(id: string): Promise<ArtistEntity> {
    try {
      await validateIsUUID(id);

      const entity = await this.storage.findById(id);

      return entity;
    } catch (error) {
      throw error;
    }
  }

  async findManyByIds(ids: string[]): Promise<ArtistEntity[]> {
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
    updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistEntity> {
    try {
      await validateIsUUID(id);

      const originalEntity = await this.storage.findById(id);

      const updatedEntityInstance = plainToClass(
        UpdateArtistDto,
        updateArtistDto,
      );

      const entityForUpdate: ArtistEntity = {
        ...originalEntity,
        ...updatedEntityInstance,
      };

      const updatedEntityDbResponse = await this.storage.updateById(
        id,
        entityForUpdate,
      );

      const plainUpdatedEntity = instanceToPlain(
        updatedEntityDbResponse,
      ) as IArtist;

      return plainUpdatedEntity;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await validateIsUUID(id);

      await this.storage.removeById(id);
    } catch (error) {
      throw error;
    }
  }
}
