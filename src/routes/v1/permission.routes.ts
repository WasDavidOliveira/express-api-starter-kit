import { Router } from 'express';
import PermissionController from '@/controllers/v1/permission.controller';
import {
  createPermissionSchema,
  updatePermissionSchema,
} from '@/validations/v1/permission.validations';
import { validateRequest } from '@/middlewares/validate-request.middlewares';
import { hasPermission } from '@/middlewares/permission.middleware';
import { PermissionActions } from '@/constants/permission.constants';

const router = Router();

router.post(
  '/',
  hasPermission('user', PermissionActions.CREATE),
  validateRequest(createPermissionSchema),
  PermissionController.create
);

router.get(
  '/:id',
  hasPermission('user', PermissionActions.READ),
  PermissionController.show
);

router.delete(
  '/:id',
  hasPermission('user', PermissionActions.DELETE),
  PermissionController.delete
);

router.put(
  '/:id',
  hasPermission('user', PermissionActions.UPDATE),
  validateRequest(updatePermissionSchema),
  PermissionController.update
);

export default router;
