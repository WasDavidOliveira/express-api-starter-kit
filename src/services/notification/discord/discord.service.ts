import { BaseNotificationProvider } from '@/providers/notification/notification.provider';
import { ErrorEvent, NotificationEvent } from '@/types/core/events.types';
import {
  DiscordWebhookConfig,
  DiscordWebhookPayload,
  DiscordEmbed,
} from '@/types/core/notification';
import { logger } from '@/utils/core/logger.utils';
import { DiscordMessageBuilder } from '@/builders/notification';

export class DiscordNotificationService extends BaseNotificationProvider {
  private config: DiscordWebhookConfig;

  constructor(config: DiscordWebhookConfig) {
    super(true);
    this.config = config;
  }

  async sendNotification(event: NotificationEvent): Promise<void> {
    if (!this.isEnabled() || !this.config.url) {
      return;
    }

    const embed = DiscordMessageBuilder.createNotificationEmbed(event);
    const payload = this.createWebhookPayload([embed]);

    await this.sendWebhook(payload);
  }

  async sendErrorNotification(event: ErrorEvent): Promise<void> {
    if (!this.isEnabled() || !this.config.url) {
      return;
    }

    const embed = DiscordMessageBuilder.createErrorEmbed(event);
    const payload = this.createWebhookPayload([embed]);

    await this.sendWebhook(payload);
  }

  protected createWebhookPayload(
    embeds: DiscordEmbed[],
  ): DiscordWebhookPayload {
    return {
      username: this.config.username || 'API Monitor',
      avatar_url: this.config.avatarUrl,
      content: undefined,
      embeds,
    };
  }

  protected async sendWebhook(payload: DiscordWebhookPayload): Promise<void> {
    if (!this.config.url) {
      logger.warn('Discord webhook URL not configured');
      return;
    }

    const response = await fetch(this.config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorMessage = `Discord webhook failed: ${response.status} ${response.statusText}`;
      logger.error('Failed to send Discord notification:', errorMessage);
      return;
    }

    logger.info('Discord notification sent successfully');
  }

  public isEnabled(): boolean {
    return this.config.enabled !== false;
  }
}
