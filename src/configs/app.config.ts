import dotenv from 'dotenv';

dotenv.config();

const createDatabaseUrl = (): string => {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || 'senha';
  const database = process.env.DB_NAME || 'carajapp';

  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
};

export const appConfig = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
  ],
  databaseUrl: createDatabaseUrl(),
  jwtSecret: process.env.JWT_SECRET || '' as string,
  jwtExpiration: process.env.JWT_EXPIRATION || '1h',
  jwtRefreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d',
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || '',
};

export default appConfig;
