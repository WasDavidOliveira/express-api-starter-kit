import { SQL } from 'drizzle-orm';

interface IBaseRepository<TModel, TCreateModel extends object> {
  create(data: TCreateModel): Promise<TModel>;
  update(id: number, data: Partial<TCreateModel>): Promise<TModel>;
  findById(id: number): Promise<TModel | null>;
  findAll(): Promise<TModel[]>;
  delete(id: number): Promise<void>;
  findByCondition(condition: SQL): Promise<TModel[]>;
  findOneByCondition(condition: SQL): Promise<TModel | null>;
}

export type { IBaseRepository };
