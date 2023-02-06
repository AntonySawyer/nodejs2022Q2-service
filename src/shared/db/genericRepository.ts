import { InternalError, NotFoundError } from '../error';
import { IGenericRepository } from './db.interface';

export class GenericRepository<TType> implements IGenericRepository<TType> {
  private dataSource = new Map<string, TType>();

  private set data(data: Map<string, TType>) {
    this.dataSource = data;
  }

  private get data() {
    return this.dataSource;
  }

  public async find(): Promise<TType[]> {
    const dataArray = [...this.data.values()];

    return dataArray;
  }

  public async findById(id: string): Promise<TType | undefined> {
    const result = this.data.get(id);

    if (!result) {
      throw new NotFoundError('Not found');
    }

    return result;
  }

  public async create(id: string, entity: TType): Promise<TType> {
    this.data.set(id, entity);

    return entity;
  }

  public async removeById(id: string): Promise<void> {
    try {
      const isRemoved = this.data.delete(id);

      if (!isRemoved) {
        throw new NotFoundError('Not found');
      }
    } catch (error) {
      const isNotFoundError = error instanceof NotFoundError;

      if (isNotFoundError) {
        throw error;
      }

      throw new InternalError('Something went wrong');
    }
  }

  public async updateById(id: string, updatedEntity: TType): Promise<TType> {
    const originalEntity = await this.findById(id);

    try {
      const entityForSave = {
        ...originalEntity,
        ...updatedEntity,
      };

      this.data.set(id, entityForSave);

      return entityForSave;
    } catch (error) {
      throw new InternalError('Something went wrong');
    }
  }
}
