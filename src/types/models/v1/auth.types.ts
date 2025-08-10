import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { user } from '@/db/schema/v1/user.schema';

export type UserModel = InferSelectModel<typeof user>;
export type CreateUserModel = InferInsertModel<typeof user>;
