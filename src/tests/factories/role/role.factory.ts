import { faker } from '@faker-js/faker';
import { CreateRoleModel, RoleModel } from '@/types/models/v1/role.types';
import RoleRepository from '@/repositories/v1/modules/role/role.repository';
import { CreateRoleInput } from '@/validations/v1/modules/role.validations';

export class RoleFactory {
  static makeRoleData(
    overrides: Partial<CreateRoleInput> = {}
  ): CreateRoleInput {
    return {
      name: `${faker.company.buzzNoun()}_${Date.now()}`,
      description: faker.lorem.sentence(),
      ...overrides,
    };
  }

  static async createRole(
    overrides: Partial<CreateRoleModel> = {}
  ): Promise<RoleModel> {
    const roleData = this.makeRoleData(overrides);

    const role = await RoleRepository.create(roleData);

    return role;
  }

  static async createRoles(
    count: number = 3,
    overrides: Partial<CreateRoleModel> = {}
  ): Promise<RoleModel[]> {
    const roles = [];

    for (let i = 0; i < count; i++) {
      const role = await this.createRole(overrides);
      roles.push(role);
    }

    return roles;
  }
}
