import { DiscordNotificationService } from '@/services/notification/discord';
import { TelegramNotificationService } from '@/services/notification/telegram';
import { NotificationProvider } from '@/providers/notification/notification.provider';
import { discordConfig } from '@/configs/providers/discord.config';
import { telegramConfig } from '@/configs/providers/telegram.config';

export class NotificationFactory {
  static createNotificationProviders(): NotificationProvider[] {
    const providers: NotificationProvider[] = [];

    if (discordConfig.enabled && discordConfig.url) {
      const discordService = new DiscordNotificationService(discordConfig);
      providers.push(discordService);
    }

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
