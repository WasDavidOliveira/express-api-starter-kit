import { pgTable, primaryKey, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { roles } from '@/db/schema/v1/role.schema';
import { permissions } from '@/db/schema/v1/permission.schema';

export const rolePermissions = pgTable(
  'role_permissions',
  {
    roleId: integer('role_id')
      .notNull()
      .references(() => roles.id),
    permissionId: integer('permission_id')
      .notNull()
      .references(() => permissions.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
    };
  }
);

export const rolePermissionRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  })
);
