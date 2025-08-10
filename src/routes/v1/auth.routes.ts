import { Router } from 'express';
import AuthController from '@/controllers/v1/auth.controller';
import { registerSchema, loginSchema } from '@/validations/v1/auth.validations';
import { validateRequest } from '@/middlewares/validate-request.middlewares';
import { authMiddleware } from '@/middlewares/auth.middlewares';

const router: Router = Router();

router.post('/login', validateRequest(loginSchema), AuthController.login);

router.post(
  '/register',
  validateRequest(registerSchema),
  AuthController.register
);

router.get('/me', authMiddleware, AuthController.me);

export default router;
