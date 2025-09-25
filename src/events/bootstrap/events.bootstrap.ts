import { NotificationManagerService } from '@/services/notification/notification-manager.service';
import { ActivityLogService } from '@/services/analytics/activity-log.service';

export const BoostrapEventServices = (): void => {
  NotificationManagerService.initialize();
  ActivityLogService.initialize();
};
