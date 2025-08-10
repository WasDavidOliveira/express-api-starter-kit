import { CorsOptions } from 'cors';
import { developmentCorsConfig } from '@/configs/environments/cors/cors.development';
import { productionCorsConfig } from '@/configs/environments/cors/cors.production';

const isDevelopment = process.env.NODE_ENV === 'development';

export const corsConfig: CorsOptions = isDevelopment
  ? developmentCorsConfig
  : productionCorsConfig;
