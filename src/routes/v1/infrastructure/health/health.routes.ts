import { Router } from 'express';
import HealthController from '@/controllers/v1/infrastructure/health/health.controller';

const router: Router = Router();
router.get('/', HealthController.index);

export default router;


