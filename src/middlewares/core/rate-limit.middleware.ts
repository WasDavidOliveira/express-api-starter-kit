import rateLimit from 'express-rate-limit';
import { appConfig } from '@/configs/app.config';

export const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: appConfig.rateLimitMaxPerMinute,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message:
      'Muitas requisições deste IP, por favor tente novamente após 1 minuto',
  },
});
