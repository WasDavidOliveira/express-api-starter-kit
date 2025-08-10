import type { Config } from 'drizzle-kit';
import appConfig from './src/configs/app.config';

export default {
  schema: './src/db/schema/v1',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: appConfig.databaseUrl,
  },
  migrations: {
    schema: 'public',
  },
} satisfies Config;