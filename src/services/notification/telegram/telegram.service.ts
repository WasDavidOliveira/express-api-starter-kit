import { BaseNotificationProvider } from '@/providers/notification/notification.provider';
import { ErrorEvent, NotificationEvent } from '@/types/core/events.types';
import {
  TelegramConfig,
  TelegramMessage,
  TelegramResponse,
} from '@/types/core/notification';
import { logger } from '@/utils/core/logger.utils';
import { TelegramMessageBuilder } from '@/builders/notification';

export class TelegramNotificationService extends BaseNotificationProvider {
  protected config: TelegramConfig;
  protected readonly apiUrl: string;

  constructor(config: TelegramConfig) {
    super(config.enabled);
    this.config = config;
    this.apiUrl = `https://api.telegram.org/bot${config.botToken}`;
  }

  async sendNotification(event: NotificationEvent): Promise<void> {
    if (!this.isEnabled()) {
      return;
    }

    const message = TelegramMessageBuilder.createNotificationMessage(event);
    await this.sendMessage(message);
  }

  async sendErrorNotification(event: ErrorEvent): Promise<void> {
    if (!this.isEnabled()) {
      return;
    }

    const message = TelegramMessageBuilder.createErrorMessage(event);
    await this.sendMessage(message);
  }

  protected async sendMessage(text: string): Promise<void> {
    if (!this.config.botToken || !this.config.chatId) {
      logger.warn('Telegram bot token or chat ID not configured');
      return;
    }

    const message: TelegramMessage = {
      chat_id: this.config.chatId,
      text,
      parse_mode: this.config.parseMode ?? 'HTML',
      disable_web_page_preview: true,
    };

    const response = await fetch(`${this.apiUrl}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result: TelegramResponse = await response.json();

    if (!result.ok) {
      const errorMessage = `Telegram API error: ${result.error_code} - ${result.description}`;
      logger.error('Failed to send Telegram notification:', errorMessage);
      logger.error('Full response:', JSON.stringify(result, null, 2));
      return;
    }

    logger.info('Telegram notification sent successfully');
  }

  public isEnabled(): boolean {
    return (
      this.config.enabled && !!this.config.botToken && !!this.config.chatId
    );
  }
}
