import { roles } from '@/db/schema/v1/role.schema';
import { BaseRepository } from '@/repositories/v1/base/base.repository';
import { CreateRoleModel, RoleModel } from '@/types/models/v1/role.types';
import { rolePermissions } from '@/db/schema/v1/role-permission.schema';
import { db } from '@/db/db.connection';
import { eq } from 'drizzle-orm';

class RoleRepository extends BaseRepository<RoleModel, CreateRoleModel> {
  protected table = roles;
  protected idColumn = roles.id;
  protected enableActivityLog = true;

  async delete(id: number): Promise<void> {
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, id));
    await db.delete(roles).where(eq(roles.id, id));
  }
}

export default new RoleRepository();
