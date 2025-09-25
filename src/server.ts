import express from 'express';
import 'dotenv/config';
import appConfig from '@/configs/app.config';
import { logger } from '@/utils/core/logger.utils';
import { bootstrapMiddlewares } from '@/middlewares/core/bootstrap.middleware';
import { NotificationManagerService } from '@/services/notification/notification-manager.service';
import { ActivityLogService } from '@/services/v1/analytics/activity-log.service';

const app = express();

bootstrapMiddlewares(app);

NotificationManagerService.initialize();
ActivityLogService.initialize();

app.listen(appConfig.port, () => {
  logger.serverStartup(appConfig.nodeEnv, appConfig.port as number);
});

export default app;
