import { ErrorEvent, NotificationEvent } from '@/types/core/events.types';

export interface NotificationProvider {
  sendErrorNotification(event: ErrorEvent): Promise<void>;
  sendNotification(event: NotificationEvent): Promise<void>;
  isEnabled(): boolean;
}

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
