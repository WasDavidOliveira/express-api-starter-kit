import { Router } from 'express';
import authRoutes from '@/routes/v1/modules/auth/auth.routes';
import permissionRoutes from '@/routes/v1/modules/permission/permission.routes';
import { authMiddleware } from '@/middlewares/auth/auth.middlewares';
import rolePermissionRoutes from '@/routes/v1/modules/role-permission/role-permission.routes';
import roleRoutes from '@/routes/v1/modules/role/roles.routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/permissions', authMiddleware, permissionRoutes);
router.use('/roles', authMiddleware, roleRoutes);
router.use('/roles-permissions', authMiddleware, rolePermissionRoutes);

export default router;
