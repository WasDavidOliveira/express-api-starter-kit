import { appConfig } from '@/configs/app.config';
import { TelegramConfig } from '@/types/core/notification';

export const telegramConfig: TelegramConfig = {
  enabled: appConfig.telegram.enabled,
  botToken: appConfig.telegram.botToken,
  chatId: appConfig.telegram.chatId,
  parseMode: appConfig.telegram.parseMode,
};
