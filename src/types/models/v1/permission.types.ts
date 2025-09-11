import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { permissions } from '@/db/schema/v1/permission.schema';
import { PermissionAction } from '@/constants/permission.constants';

export type PermissionModel = InferSelectModel<typeof permissions>;
export type CreatePermissionModel = InferInsertModel<typeof permissions>;

export type PermissionCheck = {
  name: string;
  action: PermissionAction;
};
