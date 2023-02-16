import { FindOneOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { InternalError, NotFoundError } from '../error';
import { EntityWithId, IGenericRepository } from './db.interface';

export class GenericRepository<TType extends EntityWithId>
  implements IGenericRepository<TType>
{
  constructor(targetRepository: Repository<TType>) {
    this.storage = targetRepository;
  }

  private storage: Repository<TType>;

  public async find(): Promise<TType[]> {
    const data = await this.storage.find();

    return data;
  }

  public async findManyByIds(ids: string[]): Promise<TType[]> {
    const data = await this.storage.find({
      where: {
        id: In(ids),
      } as FindOptionsWhere<TType>,
    });

    return data;
  }

  public async findById(id: string): Promise<TType | undefined> {
    const result = await this.storage.findOne({
      where: {
        id,
      },
    } as FindOneOptions<TType>);

    if (!result) {
      throw new NotFoundError('Not found');
    }

    return result;
  }

  public async create(entity: TType): Promise<TType> {
    try {
      await this.storage.save(entity);

      return entity;
    } catch (error) {
      throw error;
    }
  }

  public async removeById(id: string): Promise<void> {
    try {
      const isExist = await this.findById(id);

      if (!isExist) {
        throw new NotFoundError('Not found');
      }

      await this.removeBy('id', id);
    } catch (error) {
      const isNotFoundError = error instanceof NotFoundError;

      if (isNotFoundError) {
        throw error;
      }

      throw new InternalError('Something went wrong');
    }
  }

  public async removeBy(field: string, value: string): Promise<void> {
    try {
      await this.storage.delete({
        [field]: value,
      } as FindOptionsWhere<TType>);
    } catch (error) {
      throw error;
    }
  }

  public async updateById(id: string, updatedEntity: TType): Promise<TType> {
    try {
      const body = { ...updatedEntity };
      delete body.id;

      await this.storage.update(
        id,
        body as unknown as QueryDeepPartialEntity<TType>,
      );

      const originalEntity = await this.findById(id);

      return originalEntity;
    } catch (error) {
      throw new InternalError('Something went wrong');
    }
  }
}
