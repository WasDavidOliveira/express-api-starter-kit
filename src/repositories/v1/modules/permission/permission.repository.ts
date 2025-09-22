import { permissions } from '@/db/schema/v1/permission.schema';
import { BaseRepository } from '@/repositories/v1/modules/base/base.repository';
import {
  CreatePermissionModel,
  PermissionModel,
} from '@/types/models/v1/permission.types';

class PermissionRepository extends BaseRepository<
  PermissionModel,
  CreatePermissionModel
> {
  protected table = permissions;
  protected idColumn = permissions.id;
}

export default new PermissionRepository();
