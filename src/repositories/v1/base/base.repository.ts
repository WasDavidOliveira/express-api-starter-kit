import { db } from '@/db/db.connection';
import { eq, SQL } from 'drizzle-orm';
import { PgTable, PgColumn } from 'drizzle-orm/pg-core';
import { IBaseRepository } from '@/types/infrastructure/repository.types';
import {
  emitCreateEvent,
  emitUpdateEvent,
  emitDeleteEvent,
} from '@/events/analytics/activity-log.events';
import {
  getUserId,
  getUserAgent,
  getIp,
} from '@/utils/core/request-context.utils';
import { NotFoundError } from '@/exceptions/app.exceptions';

abstract class BaseRepository<
  TModel,
  TCreateModel extends Record<string, unknown>,
> implements IBaseRepository<TModel, TCreateModel>
{
  protected abstract table: PgTable;
  protected abstract idColumn: PgColumn;
  protected abstract tableName: string;
  protected enableActivityLog: boolean = false;

  protected getTableName(): string {
    return this.tableName;
  }

  protected getContextInfo() {
    return {
      userId: getUserId() ?? undefined,
      userAgent: getUserAgent() ?? undefined,
      ip: getIp() ?? undefined,
    };
  }

  async create(data: TCreateModel): Promise<TModel> {
    const [newRecord] = await db
      .insert(this.table)
      .values(data as Record<string, unknown>)
      .returning();

    if (this.enableActivityLog) {
      emitCreateEvent(
        this.getTableName(),
        (newRecord as Record<string, unknown>).id as number,
        newRecord as Record<string, unknown>,
        this.getContextInfo(),
      );
    }

    return newRecord as TModel;
  }

  async update(id: number, data: Partial<TCreateModel>): Promise<TModel> {
    const oldRecord = this.enableActivityLog ? await this.findById(id) : null;

    if (!oldRecord) {
      const tableName = this.getTableName();

      throw new NotFoundError(`${tableName} não encontrado`);
    }

    const [updatedRecord] = await db
      .update(this.table)
      .set(data as Record<string, unknown>)
      .where(eq(this.idColumn, id))
      .returning();

    if (this.enableActivityLog && oldRecord) {
      emitUpdateEvent(
        this.getTableName(),
        id,
        oldRecord as Record<string, unknown>,
        updatedRecord as Record<string, unknown>,
        this.getContextInfo(),
      );
    }

    return updatedRecord as TModel;
  }

  async findById(id: number): Promise<TModel | null> {
    const results = await db
      .select()
      .from(this.table)
      .where(eq(this.idColumn, id))
      .limit(1);

    if (!results[0]) {
      const tableName = this.getTableName();

      throw new NotFoundError(`${tableName} não encontrado`);
    }

    return results[0] as TModel;
  }

  async findAll(): Promise<TModel[]> {
    const results = await db.select().from(this.table);
    return results as TModel[];
  }

  async delete(id: number): Promise<void> {
    const oldRecord = this.enableActivityLog ? await this.findById(id) : null;

    if (!oldRecord) {
      const tableName = this.getTableName();

      throw new NotFoundError(`${tableName} não encontrado`);
    }

    await db.delete(this.table).where(eq(this.idColumn, id));

    if (this.enableActivityLog && oldRecord) {
      emitDeleteEvent(
        this.getTableName(),
        id,
        oldRecord as Record<string, unknown>,
        this.getContextInfo(),
      );
    }
  }

  async findByCondition(condition: SQL): Promise<TModel[]> {
    const results = await db.select().from(this.table).where(condition);

    if (!results[0]) {
      const tableName = this.getTableName();

      throw new NotFoundError(`${tableName} não encontrado`);
    }

    return results as TModel[];
  }

  async findOneByCondition(condition: SQL): Promise<TModel | null> {
    const results = await db
      .select()
      .from(this.table)
      .where(condition)
      .limit(1);

    if (!results[0]) {
      const tableName = this.getTableName();

      throw new NotFoundError(`${tableName} não encontrado`);
    }

    return results[0] as TModel;
  }
}

export { BaseRepository };
