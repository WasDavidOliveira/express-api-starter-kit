import { Router } from 'express';
import modulesRoutes from '@/routes/v1/modules/modules.routes';
import healthRoutes from '@/routes/v1/infrastructure/health/health.routes';

const router: Router = Router();

router.use('/health', healthRoutes);
router.use('/', modulesRoutes);

export default router;
