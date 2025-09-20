import { BaseNotificationProvider } from '@/providers/notification/notification.provider';
import { ErrorEvent, NotificationEvent } from '@/types/core/events.types';
import {
  DiscordWebhookConfig,
  DiscordWebhookPayload,
  DiscordEmbed,
} from '@/types/core/notification';
import { logger } from '@/utils/core/logger.utils';

export class DiscordNotificationService extends BaseNotificationProvider {
  private config: DiscordWebhookConfig;

  constructor(config: DiscordWebhookConfig) {
    super(config.enabled);
    this.config = config;
  }

  async sendErrorNotification(event: ErrorEvent): Promise<void> {
    if (!this.isEnabled() || !this.config.url) {
      return;
    }

    const embed = this.createErrorEmbed(event);
    const payload = this.createWebhookPayload([embed]);

    await this.sendWebhook(payload);
  }

  async sendNotification(event: NotificationEvent): Promise<void> {
    if (!this.isEnabled() || !this.config.url) {
      return;
    }

    const embed = this.createNotificationEmbed(event);
    const payload = this.createWebhookPayload([embed]);

    await this.sendWebhook(payload);
  }

  protected createErrorEmbed(event: ErrorEvent): DiscordEmbed {
    const { error, method, url, environment, userAgent, ip } = event.data;

    return {
      title: '🚨 Erro na Aplicação',
      description: `**${error.name}**: ${error.message}`,
      color: 0xff0000,
      fields: [
        {
          name: '📍 Endpoint',
          value: `${method} ${url}`,
          inline: true,
        },
        {
          name: '🌍 Ambiente',
          value: environment,
          inline: true,
        },
        {
          name: '⏰ Timestamp',
          value: event.timestamp.toISOString(),
          inline: true,
        },
        ...(userAgent
          ? [
              {
                name: '🖥️ User Agent',
                value: userAgent.substring(0, 100),
                inline: false,
              },
            ]
          : []),
        ...(ip
          ? [
              {
                name: '🔗 IP',
                value: ip,
                inline: true,
              },
            ]
          : []),
        {
          name: '📋 Stack Trace',
          value: `\`\`\`\n${error.stack?.substring(0, 1000) ?? 'Não disponível'}\n\`\`\``,
          inline: false,
        },
      ],
      timestamp: event.timestamp.toISOString(),
      footer: {
        text: 'Sistema de Monitoramento',
      },
    };
  }

  protected createNotificationEmbed(event: NotificationEvent): DiscordEmbed {
    const { title, description, level, color, stack } = event.data;

    const levelColors = {
      success: 0x00ff00,
      warning: 0xffff00,
      info: 0x0099ff,
      error: 0xff0000,
    };

    const levelIcons = {
      success: '✅',
      warning: '⚠️',
      info: 'ℹ️',
      error: '🚨',
    };

    const fields = [];

    if (stack) {
      fields.push({
        name: '📋 Stack Trace',
        value: `\`\`\`\n${stack.substring(0, 1000)}\n\`\`\``,
        inline: false,
      });
    }

    return {
      title: `${levelIcons[level]} ${title}`,
      description,
      color: color ?? levelColors[level],
      fields: fields.length > 0 ? fields : undefined,
      timestamp: event.timestamp.toISOString(),
      footer: {
        text: 'Sistema de Notificações',
      },
    };
  }

  protected createWebhookPayload(
    embeds: DiscordEmbed[],
  ): DiscordWebhookPayload {
    return {
      username: this.config.username,
      avatar_url: this.config.avatarUrl,
      embeds,
    };
  }

  protected async sendWebhook(payload: DiscordWebhookPayload): Promise<void> {
    try {
      const response = await fetch(this.config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `Discord webhook failed: ${response.status} - ${errorText}`,
        );
      }
    } catch (error) {
      logger.error('Erro ao enviar notificação Discord:', error);
    }
  }
}
