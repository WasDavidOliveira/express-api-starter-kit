import { RoleFactory } from '@/tests/factories/role/role.factory';
import { PermissionFactory } from '@/tests/factories/permission/permission.factory';
import RolePermissionRepository from '@/repositories/v1/modules/role-permission/role-permission.repository';
import { RoleModel } from '@/types/models/v1/role.types';
import { PermissionModel } from '@/types/models/v1/permission.types';

export class RolePermissionFactory {
  static async createRoleWithPermissions(
    permissionCount: number = 2,
  ): Promise<{ role: RoleModel; permissions: PermissionModel[] }> {
    const role = await RoleFactory.createRole();
    const permissions =
      await PermissionFactory.createPermissions(permissionCount);

    for (const permission of permissions) {
      await RolePermissionRepository.attach(role.id, permission.id);
    }

    return { role, permissions };
  }

  static async attachPermissionToRole(roleId: number, permissionId: number) {
    return RolePermissionRepository.attach(roleId, permissionId);
  }
}
