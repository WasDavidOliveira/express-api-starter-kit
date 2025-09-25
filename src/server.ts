import express from 'express';
import 'dotenv/config';
import appConfig from '@/configs/app.config';
import { logger } from '@/utils/core/logger.utils';
import { bootstrapMiddlewares } from '@/middlewares/core/bootstrap.middleware';
import { BoostrapEventServices } from '@/events/bootstrap/events.bootstrap';

const app = express();

bootstrapMiddlewares(app);

BoostrapEventServices();

app.listen(appConfig.port, () => {
  logger.serverStartup(appConfig.nodeEnv, appConfig.port as number);
});

export default app;
