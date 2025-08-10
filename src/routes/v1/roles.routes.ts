import { Router } from 'express';
import RoleController from '@/controllers/v1/role.controller';
import {
  createRoleSchema,
  updateRoleSchema,
} from '@/validations/v1/role.validations';
import { validateRequest } from '@/middlewares/validate-request.middlewares';
import { hasPermission } from '@/middlewares/permission.middleware';
import { PermissionActions } from '@/constants/permission.constants';

const router = Router();

router.post(
  '/',
  hasPermission('role', PermissionActions.CREATE),
  validateRequest(createRoleSchema),
  RoleController.create
);

router.get(
  '/all',
  hasPermission('role', PermissionActions.READ),
  RoleController.index
);

router.get(
  '/:id',
  hasPermission('role', PermissionActions.READ),
  RoleController.show
);

router.put(
  '/:id',
  hasPermission('role', PermissionActions.UPDATE),
  validateRequest(updateRoleSchema),
  RoleController.update
);

router.delete(
  '/:id',
  hasPermission('role', PermissionActions.DELETE),
  RoleController.delete
);

export default router;
