import { discordConfig } from '@/configs/providers/discord.config';
import { telegramConfig } from '@/configs/providers/telegram.config';
import {
  DiscordWebhookConfig,
  TelegramConfig,
} from '@/types/core/notification';

export class NotificationConfigFactory {
  static createDiscordConfig(): DiscordWebhookConfig {
    return discordConfig;
  }

  static createTelegramConfig(): TelegramConfig {
    return telegramConfig;
  }
}
