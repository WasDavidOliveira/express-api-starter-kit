import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { roles } from '@/db/schema/v1/role.schema';

export type RoleModel = InferSelectModel<typeof roles>;
export type CreateRoleModel = InferInsertModel<typeof roles>;
