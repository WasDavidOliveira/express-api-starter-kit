import {
  pgTable,
  serial,
  varchar,
  text,
  json,
  timestamp,
} from 'drizzle-orm/pg-core';

export const errorLogs = pgTable('error_logs', {
  id: serial('id').primaryKey(),
  eventType: varchar('event_type', { length: 100 }).notNull(),
  serviceName: varchar('service_name', { length: 100 }).notNull(),
  errorMessage: text('error_message').notNull(),
  errorStack: text('error_stack'),
  eventData: json('event_data'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
