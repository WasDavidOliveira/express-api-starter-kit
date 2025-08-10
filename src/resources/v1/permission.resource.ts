import { PermissionModel } from '@/types/models/v1/permission.types';

export class PermissionResource {
  static toResponse(permission: PermissionModel) {
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      action: permission.action,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }

  static collectionToResponse(permissions: PermissionModel[]) {
    return permissions.map((permission) => this.toResponse(permission));
  }
}
