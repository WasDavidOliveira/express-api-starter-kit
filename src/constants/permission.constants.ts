export const PermissionActions = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
} as const;

export type PermissionAction =
  (typeof PermissionActions)[keyof typeof PermissionActions];
