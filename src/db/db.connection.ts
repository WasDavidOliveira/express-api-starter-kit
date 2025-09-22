import { user, userRelations } from '@/db/schema/v1/user.schema';
import { roles, roleRelations } from '@/db/schema/v1/role.schema';
import {
  permissions,
  permissionRelations,
} from '@/db/schema/v1/permission.schema';
import {
  rolePermissions,
  rolePermissionRelations,
} from '@/db/schema/v1/role-permission.schema';
import { userRoles, userRoleRelations } from '@/db/schema/v1/user-role.schema';
import { activityLogs } from '@/db/schema/v1/activity-log.schema';
import appConfig from '@/configs/app.config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: appConfig.databaseUrl,
  ssl: false,
});

export const db = drizzle(pool, {
  schema: {
    user,
    userRelations,
    roles,
    roleRelations,
    permissions,
    permissionRelations,
    rolePermissions,
    rolePermissionRelations,
    userRoles,
    userRoleRelations,
    activityLogs,
  },
});
