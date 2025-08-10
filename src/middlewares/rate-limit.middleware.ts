import rateLimit from 'express-rate-limit';

export const globalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 60, // limite de 60 requisições por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message:
      'Muitas requisições deste IP, por favor tente novamente após 1 minuto',
  },
});
