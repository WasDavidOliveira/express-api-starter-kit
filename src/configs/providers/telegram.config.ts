import { appConfig } from '@/configs/app.config';
import { TelegramConfig } from '@/types/core/notification';
import {
  TelegramParseMode,
  isValidTelegramParseMode,
} from '@/constants/notification';

const validateParseMode = (parseMode: unknown): TelegramParseMode => {
  if (typeof parseMode === 'string' && isValidTelegramParseMode(parseMode)) {
    return parseMode;
  }
  return TelegramParseMode.HTML;
};

export const telegramConfig: TelegramConfig = {
  enabled: appConfig.telegram.enabled,
  botToken: appConfig.telegram.botToken,
  chatId: appConfig.telegram.chatId,
  parseMode: validateParseMode(appConfig.telegram.parseMode),
};
