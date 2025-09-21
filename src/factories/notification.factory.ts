import { DiscordNotificationService } from '@/services/notification/discord.service';
import { TelegramNotificationService } from '@/services/notification/telegram.service';
import { NotificationProvider } from '@/providers/notification/notification.provider';
import {
  DiscordWebhookConfig,
  TelegramConfig,
} from '@/types/core/notification';
import { appConfig } from '@/configs/app.config';
import { eventEmitter } from '@/events';
import { ErrorEvent, NotificationEvent } from '@/types/core/events.types';

export class NotificationFactory {
  static createNotificationProviders(): NotificationProvider[] {
    const providers: NotificationProvider[] = [];

    const discordConfig: DiscordWebhookConfig = {
      enabled: appConfig.discord.webhookEnabled,
      url: appConfig.discord.webhookUrl,
      username: appConfig.discord.username,
      avatarUrl: appConfig.discord.avatarUrl,
    };

    const discordService = new DiscordNotificationService(discordConfig);
    providers.push(discordService);

    const telegramConfig: TelegramConfig = {
      enabled: appConfig.telegram.enabled,
      botToken: appConfig.telegram.botToken,
      chatId: appConfig.telegram.chatId,
      parseMode: appConfig.telegram.parseMode,
    };

    const telegramService = new TelegramNotificationService(telegramConfig);
    providers.push(telegramService);

    return providers;
  }

  static setupNotificationListeners(): void {
    const providers = this.createNotificationProviders();

    eventEmitter.on('error', async event => {
      if (event.type === 'error') {
        const enabledProviders = providers.filter(provider =>
          provider.isEnabled(),
        );

        await Promise.allSettled(
          enabledProviders.map(provider =>
            provider.sendErrorNotification(event as ErrorEvent),
          ),
        );
      }
    });

    eventEmitter.on('notification', async event => {
      if (event.type === 'notification') {
        const enabledProviders = providers.filter(provider =>
          provider.isEnabled(),
        );

        await Promise.allSettled(
          enabledProviders.map(provider =>
            provider.sendNotification(event as NotificationEvent),
          ),
        );
      }
    });
  }
}
