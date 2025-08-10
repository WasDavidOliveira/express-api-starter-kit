import { HelmetOptions } from 'helmet';
import { developmentHelmetConfig } from '@/configs/environments/helmet/helmet.development';
import { productionHelmetConfig } from '@/configs/environments/helmet/helmet.production';

const isDevelopment = process.env.NODE_ENV === 'development';

export const helmetConfig: HelmetOptions = isDevelopment
  ? developmentHelmetConfig
  : productionHelmetConfig;
