import { db } from '@/db/db.connection';
import { eq, SQL } from 'drizzle-orm';
import { PgTable, PgColumn } from 'drizzle-orm/pg-core';
import { IBaseRepository } from '@/types/infrastructure/repository.types';

abstract class BaseRepository<
  TModel,
  TCreateModel extends Record<string, unknown>,
> implements IBaseRepository<TModel, TCreateModel>
{
  protected abstract table: PgTable;
  protected abstract idColumn: PgColumn;

  async create(data: TCreateModel): Promise<TModel> {
    const [newRecord] = await db
      .insert(this.table)
      .values(data as Record<string, unknown>)
      .returning();

    return newRecord as TModel;
  }

  async update(id: number, data: Partial<TCreateModel>): Promise<TModel> {
    const [updatedRecord] = await db
      .update(this.table)
      .set(data as Record<string, unknown>)
      .where(eq(this.idColumn, id))
      .returning();

    return updatedRecord as TModel;
  }

  async findById(id: number): Promise<TModel | null> {
    const results = await db
      .select()
      .from(this.table)
      .where(eq(this.idColumn, id))
      .limit(1);

    return (results[0] as TModel) ?? null;
  }

  async findAll(): Promise<TModel[]> {
    const results = await db.select().from(this.table);
    return results as TModel[];
  }

  async delete(id: number): Promise<void> {
    await db.delete(this.table).where(eq(this.idColumn, id));
  }

  async findByCondition(condition: SQL): Promise<TModel[]> {
    const results = await db.select().from(this.table).where(condition);
    return results as TModel[];
  }

  async findOneByCondition(condition: SQL): Promise<TModel | null> {
    const results = await db
      .select()
      .from(this.table)
      .where(condition)
      .limit(1);

    return (results[0] as TModel) ?? null;
  }
}

export { BaseRepository };
