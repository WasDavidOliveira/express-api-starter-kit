import { faker } from '@faker-js/faker';
import { PermissionModel } from '@/types/models/v1/permission.types';
import PermissionRepository from '@/repositories/v1/modules/permission/permission.repository';
import { CreatePermissionInput } from '@/validations/v1/modules/permission.validations';

export class PermissionFactory {
  static makePermissionData(
    overrides: Partial<CreatePermissionInput> = {}
  ): CreatePermissionInput {
    return {
      name: `${faker.hacker.verb()}_${Date.now()}`,
      description: faker.lorem.sentence(),
      action: 'read',
      ...overrides,
    };
  }

  static async createPermission(
    overrides: Partial<CreatePermissionInput> = {}
  ): Promise<PermissionModel> {
    const permissionData = this.makePermissionData(overrides);

    const permission = await PermissionRepository.create(permissionData);

    return permission;
  }

  static async createPermissions(
    count: number = 3,
    overrides: Partial<CreatePermissionInput> = {}
  ): Promise<PermissionModel[]> {
    const permissions = [];

    for (let i = 0; i < count; i++) {
      const permission = await this.createPermission(overrides);
      permissions.push(permission);
    }

    return permissions;
  }
}
