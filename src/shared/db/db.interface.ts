import { FindOptionsWhere } from 'typeorm';

export interface IGenericRepository<TType extends EntityWithId> {
  find: () => Promise<TType[]>;
  findById: (id: string) => Promise<TType | undefined>;
  findManyByIds: (ids: string[]) => Promise<TType[]>;
  create: (entity: TType) => Promise<TType>;
  updateById: (id: string, entity: Partial<TType>) => Promise<TType>;
  removeById: (id: string) => Promise<void>;
  removeBy: (condition: FindOptionsWhere<TType>) => Promise<void>;
}

export interface EntityWithId {
  id: NonNullable<string>;
}
