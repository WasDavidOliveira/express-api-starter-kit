import { CorsOptions } from 'cors';

export const productionCorsConfig: CorsOptions = {
  origin: ['https://nosso-futuro.com.br'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
  optionsSuccessStatus: 204,
};
