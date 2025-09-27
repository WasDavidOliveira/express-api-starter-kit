import { ErrorEvent, NotificationEvent } from '@/types/core/events.types';

export interface NotificationProvider {
  sendErrorNotification(event: ErrorEvent): Promise<void>;
  sendNotification(event: NotificationEvent): Promise<void>;
  isEnabled(): boolean;
}
