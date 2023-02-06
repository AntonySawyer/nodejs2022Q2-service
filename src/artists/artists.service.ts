import { Inject, Injectable } from '@nestjs/common';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { isUUID } from 'class-validator';
import { v4 as uuidV4 } from 'uuid';

import { IGenericRepository } from 'src/shared/db/db.interface';
import { GenericRepository } from 'src/shared/db/genericRepository';
import { BadRequestError } from 'src/shared/error';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from './entities/artist.entity';
import { IArtist } from './entities/artist.interface';
import { TracksService } from 'src/tracks/tracks.service';

@Injectable()
export class ArtistsService {
  constructor() {
    this.storage = new GenericRepository<ArtistEntity>();
  }

  @Inject(TracksService)
  private trackService: TracksService;

  private storage: IGenericRepository<ArtistEntity>;

  async create(createArtistDto: CreateArtistDto): Promise<ArtistEntity> {
    const newId = uuidV4();
    const newInstance = plainToClass(ArtistEntity, {
      id: newId,
      ...createArtistDto,
    });

    const createdInstance = await this.storage.create(newId, newInstance);

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
    updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistEntity> {
    try {
      const isIdValid = isUUID(id, '4');

      if (!isIdValid) {
        throw new BadRequestError('Incorrect format of id');
      }

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
      const isIdValid = isUUID(id, '4');

      if (!isIdValid) {
        throw new BadRequestError('Incorrect format of id');
      }

      await this.storage.removeById(id);

      const allTracks = await this.trackService.findAll();

      const tracksFromArtist = allTracks.filter(
        (track) => track.artistId === id,
      );

      tracksFromArtist.forEach(async (track) => {
        await this.trackService.update(track.id, {
          ...track,
          artistId: null,
        });
      });
    } catch (error) {
      throw error;
    }
  }
}
