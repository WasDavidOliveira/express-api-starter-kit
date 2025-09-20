import { NotificationFactory } from '@/factories/notification.factory';

export const initializeNotificationSystem = (): void => {
  NotificationFactory.setupNotificationListeners();
};
