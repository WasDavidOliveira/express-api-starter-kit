import { ErrorEvent, NotificationEvent } from '@/types/core/events.types';
import { NotificationProvider } from '@/types/core/notification/notification-provider.types';

export abstract class BaseNotificationProvider implements NotificationProvider {
  protected enabled: boolean;

  constructor(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  abstract sendErrorNotification(event: ErrorEvent): Promise<void>;
  abstract sendNotification(event: NotificationEvent): Promise<void>;
}
