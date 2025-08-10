import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { permissions } from '@/db/schema/v1/permission.schema';

export type PermissionModel = InferSelectModel<typeof permissions>;
export type CreatePermissionModel = InferInsertModel<typeof permissions>;
