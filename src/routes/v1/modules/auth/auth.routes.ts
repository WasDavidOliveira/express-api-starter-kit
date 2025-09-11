import { Router } from 'express';
import AuthController from '@/controllers/v1/modules/auth/auth.controller';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/validations/v1/modules/auth.validations';
import { validateRequest } from '@/middlewares/validation/validate-request.middlewares';
import { authMiddleware } from '@/middlewares/auth/auth.middlewares';

const router: Router = Router();

router.post('/login', validateRequest(loginSchema), AuthController.login);

router.post(
  '/register',
  validateRequest(registerSchema),
  AuthController.register,
);

router.get('/me', authMiddleware, AuthController.me);

router.post(
  '/forgot-password',
  validateRequest(forgotPasswordSchema),
  AuthController.forgotPassword,
);

router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema),
  AuthController.resetPassword,
);

export default router;
