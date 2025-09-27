import { Router } from 'express';
import modulesRoutes from '@/routes/v1/modules/modules.routes';

const router: Router = Router();

router.use('/', modulesRoutes);

export default router;
