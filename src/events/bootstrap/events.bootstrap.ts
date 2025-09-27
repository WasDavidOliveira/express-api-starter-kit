import { NotificationManagerService } from '@/services/notification/notification-manager.service';
import { ActivityLogService } from '@/services/analytics/activity-log.service';
import { EmailEventService } from '@/services/notification/email/email-event.service';

export const BoostrapEventServices = (): void => {
  NotificationManagerService.initialize();
  ActivityLogService.initialize();
  EmailEventService.initialize();
};
