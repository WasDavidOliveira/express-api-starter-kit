import { Router } from 'express';
import RolePermissionController from '@/controllers/v1/role-permission.controller';
import { authMiddleware } from '@/middlewares/auth.middlewares';

const router = Router();

router.get('/:roleId/all', authMiddleware, RolePermissionController.all);

router.post('/attach', authMiddleware, RolePermissionController.attach);

router.post('/detach', authMiddleware, RolePermissionController.detach);

export default router;
