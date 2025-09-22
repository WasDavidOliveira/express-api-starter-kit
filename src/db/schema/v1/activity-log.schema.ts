import {
  pgTable,
  serial,
  varchar,
  integer,
  json,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from '@/db/schema/v1/user.schema';

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => user.id),
  action: varchar('action', { length: 10 }).notNull(),
  tableName: varchar('table_name', { length: 100 }).notNull(),
  recordId: integer('record_id').notNull(),
  oldValues: json('old_values'),
  newValues: json('new_values'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
