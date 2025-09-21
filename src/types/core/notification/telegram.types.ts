export interface TelegramConfig {
  enabled: boolean;
  botToken: string;
  chatId: string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}

export interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
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
