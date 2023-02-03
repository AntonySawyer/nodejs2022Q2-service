export interface IGenericRepository<TType> {
  find: () => Promise<TType[]>;
  findById: (id: string) => Promise<TType | undefined>;
  create: (id: string, entity: TType) => Promise<TType>;
  updateById: (id: string, entity: TType) => Promise<TType>;
  removeById: (id: string) => Promise<void>;
}
