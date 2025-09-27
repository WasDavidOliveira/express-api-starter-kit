import { BaseNotificationProvider } from '@/providers/notification/notification.provider';
import { onAppEvent } from '@/events';
import { ErrorEvent, NotificationEvent } from '@/types/core/events.types';
import { NotificationFactory } from '@/factories/notification/notification.factory';

export class NotificationManagerService {
  private static instance: NotificationManagerService | null = null;
  private providers: BaseNotificationProvider[] = [];

  protected constructor(providers: BaseNotificationProvider[]) {
    this.providers = providers;

    this.setupListeners();
  }

  static initialize(): void {
    if (this.instance) {
      return;
    }

    const providers = NotificationFactory.createNotificationProviders();

    this.instance = new NotificationManagerService(providers);
  }

  protected setupListeners(): void {
    onAppEvent('error', async event => {
      if (event.type === 'error') {
        await this.sendErrorNotification(event as ErrorEvent);
      }
    });

    onAppEvent('notification', async event => {
      if (event.type === 'notification') {
        await this.sendNotification(event as NotificationEvent);
      }
    });
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
