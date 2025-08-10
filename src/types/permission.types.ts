import { PermissionAction } from '@/constants/permission.constants';

export type PermissionCheck = {
  name: string;
  action: PermissionAction;
};
