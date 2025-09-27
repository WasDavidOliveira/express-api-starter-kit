import { BaseNotificationProvider } from '@/providers/notification/notification.provider';
import { BaseEventHandler } from '@/events/core/base-event-handler';
import {
  AppEvent,
  ErrorEvent,
  NotificationEvent,
} from '@/types/core/events.types';
import { NotificationFactory } from '@/factories/notification/notification.factory';

export class NotificationManagerService extends BaseEventHandler {
  private static instance: NotificationManagerService | null = null;
  private providers: BaseNotificationProvider[] = [];

  protected constructor(providers: BaseNotificationProvider[]) {
    super();
    this.providers = providers;

    this.setupEventListeners();
  }

  static initialize(): void {
    if (this.instance) {
      return;
    }

    const providers = NotificationFactory.createNotificationProviders();

    this.instance = new NotificationManagerService(providers);
  }

  protected getEventHandlers() {
    return [
      {
        eventType: 'error',
        handler: async (event: AppEvent) =>
          this.sendErrorNotification(event as ErrorEvent),
      },
      {
        eventType: 'notification',
        handler: async (event: AppEvent) =>
          this.sendNotification(event as NotificationEvent),
      },
    ];
  }

  protected async sendErrorNotification(event: ErrorEvent): Promise<void> {
    const enabledProviders = this.providers.filter(provider =>
      provider.isEnabled(),
    );

    await Promise.allSettled(
      enabledProviders.map(provider => provider.sendErrorNotification(event)),
    );
  }

  protected async sendNotification(event: NotificationEvent): Promise<void> {
    const enabledProviders = this.providers.filter(provider =>
      provider.isEnabled(),
    );

    await Promise.allSettled(
      enabledProviders.map(provider => provider.sendNotification(event)),
    );
  }
}
