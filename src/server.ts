import express from 'express';
import 'dotenv/config';
import appConfig from '@/configs/app.config';
import { logger } from '@/utils/logger.utils';
import { bootstrapMiddlewares } from '@/middlewares/core/bootstrap.middleware';

const app = express();

bootstrapMiddlewares(app);

app.listen(appConfig.port, () => {
  logger.serverStartup(appConfig.nodeEnv, appConfig.port as number);
});

export default app;
