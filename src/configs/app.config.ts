import dotenv from 'dotenv';

dotenv.config();

const createDatabaseUrl = (): string => {
  const host = process.env.DB_HOST ?? 'localhost';
  const port = process.env.DB_PORT ?? '5432';
  const user = process.env.DB_USER ?? 'postgres';
  const password = process.env.DB_PASSWORD ?? 'senha';
  const database = process.env.DB_NAME ?? 'carajapp';

  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
};

export const appConfig = {
  port: process.env.PORT ?? 3000,
  name: process.env.APP_NAME ?? 'Starter Kit API',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS?.split(',') ?? [
    'http://localhost:5173',
  ],
  databaseUrl: createDatabaseUrl(),
  jwtSecret: process.env.JWT_SECRET ?? ('' as string),
  jwtExpiration: process.env.JWT_EXPIRATION ?? '1h',
  jwtRefreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION ?? '7d',
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET ?? '',
  rateLimitMaxPerMinute: Number(process.env.RATE_LIMIT_MAX_PER_MINUTE ?? 60),
  discord: {
    webhookEnabled: process.env.DISCORD_WEBHOOK_ENABLED === 'true',
    webhookUrl: process.env.DISCORD_WEBHOOK_URL ?? '',
    username: process.env.DISCORD_USERNAME ?? 'console-news-observer',
    avatarUrl: process.env.DISCORD_AVATAR_URL ?? '',
  },
  telegram: {
    enabled: process.env.TELEGRAM_ENABLED === 'true',
    botToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
    chatId: process.env.TELEGRAM_CHAT_ID ?? '',
    parseMode: process.env.TELEGRAM_PARSE_MODE ?? 'HTML',
  },
  email: {
    enabled: process.env.EMAIL_ENABLED === 'true',
    host: process.env.EMAIL_HOST ?? 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT ?? 587),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER ?? '',
      pass: process.env.EMAIL_PASS ?? '',
    },
    from: process.env.EMAIL_FROM ?? '',
    fromName: process.env.EMAIL_FROM_NAME ?? 'Sistema',
  },
};

export default appConfig;
