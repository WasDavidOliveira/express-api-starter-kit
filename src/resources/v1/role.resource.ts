import { RoleModel } from '@/types/models/v1/role.types';

export class RoleResource {
  static toResponse(role: RoleModel) {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  static collectionToResponse(roles: RoleModel[]) {
    return roles.map((role) => this.toResponse(role));
  }
}
