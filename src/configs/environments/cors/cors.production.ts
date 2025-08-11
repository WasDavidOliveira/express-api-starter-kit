import { CorsOptions } from 'cors';

export const productionCorsConfig: CorsOptions = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  maxAge: 86400,
  optionsSuccessStatus: 204,
};
