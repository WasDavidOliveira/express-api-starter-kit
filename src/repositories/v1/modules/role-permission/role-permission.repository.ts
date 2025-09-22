import { db } from '@/db/db.connection';
import { rolePermissions } from '@/db/schema/v1/role-permission.schema';
import { permissions } from '@/db/schema/v1/permission.schema';
import { eq } from 'drizzle-orm';
import { getTableName } from 'drizzle-orm';

class RolePermissionRepository {
  protected table = rolePermissions;
  protected tableName = getTableName(rolePermissions);
  protected enableActivityLog = true;

  static async attach(roleId: number, permissionId: number) {
    const [newRolePermission] = await db
      .insert(rolePermissions)
      .values({ roleId, permissionId })
      .returning();

    return newRolePermission;
  }

  static async detach(roleId: number, permissionId: number) {
    await db
      .delete(rolePermissions)
      .where(
        eq(rolePermissions.roleId, roleId) &&
          eq(rolePermissions.permissionId, permissionId),
      );
  }

  static async findByRolePermissionByRoleId(roleId: number) {
    const rolePermission = await db
      .select()
      .from(rolePermissions)
      .where(eq(rolePermissions.roleId, roleId));

    return rolePermission;
  }

  static async findByRolePermissionByPermissionId(permissionId: number) {
    const rolePermission = await db
      .select()
      .from(rolePermissions)
      .where(eq(rolePermissions.permissionId, permissionId));

    return rolePermission;
  }

  static async findAllByRoleId(roleId: number) {
    const rolePermissionsList = await db
      .select({
        id: permissions.id,
        name: permissions.name,
        description: permissions.description,
        action: permissions.action,
        createdAt: permissions.createdAt,
        updatedAt: permissions.updatedAt,
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId));

    return rolePermissionsList;
  }
}

export default RolePermissionRepository;
