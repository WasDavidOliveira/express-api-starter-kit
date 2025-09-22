import { DiscordNotificationService } from '@/services/notification/discord';
import { TelegramNotificationService } from '@/services/notification/telegram';
import { NotificationProvider } from '@/providers/notification/notification.provider';
import { NotificationConfigFactory } from '@/factories/notification-config.factory';

export class NotificationFactory {
  static createNotificationProviders(): NotificationProvider[] {
    const providers: NotificationProvider[] = [];

    const discordConfig = NotificationConfigFactory.createDiscordConfig();

    if (discordConfig.enabled && discordConfig.url) {
      const discordService = new DiscordNotificationService(discordConfig);

      providers.push(discordService);
    }

    const telegramConfig = NotificationConfigFactory.createTelegramConfig();

    if (
      telegramConfig.enabled &&
      telegramConfig.botToken &&
      telegramConfig.chatId
    ) {
      const telegramService = new TelegramNotificationService(telegramConfig);

      providers.push(telegramService);
    }

    return providers;
  }
}
