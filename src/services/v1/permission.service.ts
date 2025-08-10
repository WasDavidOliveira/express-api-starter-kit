import PermissionRepository from '@/repositories/v1/permission.repository';
import { NotFoundError } from '@/utils/app-error.utils';
import { CreatePermissionInput } from '@/validations/v1/permission.validations';

export class PermissionService {
  async create(permissionData: CreatePermissionInput) {
    const permission = await PermissionRepository.create(permissionData);

    return permission;
  }

  async show(id: number) {
    const permission = await PermissionRepository.findById(id);

    if (!permission) {
      throw new NotFoundError('Permissão não encontrada');
    }

    return permission;
  }

  async delete(id: number) {
    const permission = await PermissionRepository.findById(id);

    if (!permission) {
      throw new NotFoundError('Permissão não encontrada');
    }

    await PermissionRepository.delete(id);

    return true;
  }

  async update(id: number, permissionData: CreatePermissionInput) {
    const permission = await PermissionRepository.findById(id);

    if (!permission) {
      throw new NotFoundError('Permissão não encontrada');
    }

    const updatedPermission = await PermissionRepository.update(
      id,
      permissionData
    );

    return updatedPermission;
  }

  async findAll() {
    const permissions = await PermissionRepository.findAll();

    return permissions;
  }
}

export default new PermissionService();
