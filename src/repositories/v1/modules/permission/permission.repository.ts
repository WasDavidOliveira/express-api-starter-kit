import { permissions } from '@/db/schema/v1/permission.schema';
import { BaseRepository } from '@/repositories/v1/base/base.repository';
import {
  CreatePermissionModel,
  PermissionModel,
} from '@/types/models/v1/permission.types';
import { getTableName } from 'drizzle-orm';

class PermissionRepository extends BaseRepository<
  PermissionModel,
  CreatePermissionModel
> {
  protected table = permissions;
  protected idColumn = permissions.id;
  protected tableName = getTableName(permissions);
  protected enableActivityLog = true;
}

export default new PermissionRepository();
