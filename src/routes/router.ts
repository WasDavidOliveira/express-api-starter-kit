import { Router } from 'express';
import v1Routes from '@/routes/v1/v1.routes';

const router: Router = Router();

router.use('/api/v1', v1Routes);

export default router;
