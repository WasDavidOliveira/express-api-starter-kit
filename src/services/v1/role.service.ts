import RoleRepository from '@/repositories/v1/modules/role/role.repository';
import { NotFoundError } from '@/utils/app-error.utils';
import { CreateRoleInput } from '@/validations/v1/role.validations';

export class RoleService {
  async create(roleData: CreateRoleInput) {
    const role = await RoleRepository.create(roleData);

    return role;
  }

  async show(id: number) {
    const role = await RoleRepository.findById(id);

    if (!role) {
      throw new NotFoundError('Role não encontrada');
    }

    return role;
  }

  async delete(id: number) {
    const role = await RoleRepository.findById(id);

    if (!role) {
      throw new NotFoundError('Role não encontrada');
    }

    await RoleRepository.delete(id);

    return true;
  }

  async update(id: number, roleData: CreateRoleInput) {
    const role = await RoleRepository.findById(id);

    if (!role) {
      throw new NotFoundError('Role não encontrada');
    }

    const updatedRole = await RoleRepository.update(id, roleData);

    return updatedRole;
  }

  async findAll() {
    const roles = await RoleRepository.findAll();

    return roles;
  }
}

export default new RoleService();
