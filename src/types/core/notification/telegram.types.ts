import { TelegramParseMode } from '@/constants/notification';

export interface TelegramConfig {
  enabled: boolean;
  botToken: string;
  chatId: string;
  parseMode?: TelegramParseMode;
}

export interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: TelegramParseMode;
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
}

export interface TelegramResponse {
  ok: boolean;
  result?: {
    message_id: number;
    date: number;
    text: string;
  };
  error_code?: number;
  description?: string;
}
