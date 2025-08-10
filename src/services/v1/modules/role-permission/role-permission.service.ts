import RolePermissionRepository from '@/repositories/v1/modules/role-permission/role-permission.repository';
import PermissionRepository from '@/repositories/v1/modules/permission/permission.repository';
import { NotFoundError } from '@/utils/app-error.utils';

export class RolePermissionService {
  async attach(roleId: number, permissionId: number) {
    const permission = await PermissionRepository.findById(permissionId);

    if (!permission) {
      throw new NotFoundError('Permissão não encontrada');
    }

    const rolePermission = await RolePermissionRepository.attach(
      roleId,
      permissionId
    );

    return rolePermission;
  }

  async detach(roleId: number, permissionId: number) {
    await RolePermissionRepository.detach(roleId, permissionId);
  }

  async all(roleId: number) {
    const permissions = await RolePermissionRepository.findAllByRoleId(roleId);
    return permissions;
  }
}

export default new RolePermissionService();
