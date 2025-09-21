import { ErrorEvent, NotificationEvent } from '@/types/core/events.types';

export class TelegramMessageBuilder {
  static createNotificationMessage(event: NotificationEvent): string {
    const { title, description, level, stack } = event.data;
    const timestamp = event.timestamp.toISOString();

    const emoji = this.getLevelEmoji(level);
    const levelText = level.toUpperCase();

    let message = `${emoji} <b>${levelText}</b>\n\n`;
    message += `<b>📋 Título:</b> ${title}\n`;
    message += `<b>📝 Descrição:</b> ${description}\n`;
    message += `<b>🕐 Timestamp:</b> <code>${timestamp}</code>\n`;

    if (stack) {
      message += `\n<b>📚 Stack Trace:</b>\n<pre>${stack}</pre>`;
    }

    return message;
  }

  static createErrorMessage(event: ErrorEvent): string {
    const { error, method, url, environment, userAgent, ip, userId } =
      event.data;
    const timestamp = event.timestamp.toISOString();

    let message = `🚨 <b>ERRO</b>\n\n`;
    message += `<b>❌ Erro:</b> <code>${error.name}</code>\n`;
    message += `<b>📝 Mensagem:</b> ${error.message}\n`;
    message += `<b>🔗 URL:</b> <code>${method} ${url}</code>\n`;
    message += `<b>🌍 Ambiente:</b> <code>${environment}</code>\n`;
    message += `<b>🕐 Timestamp:</b> <code>${timestamp}</code>\n`;

    if (userId) {
      message += `<b>👤 User ID:</b> <code>${userId}</code>\n`;
    }

    if (ip) {
      message += `<b>🌐 IP:</b> <code>${ip}</code>\n`;
    }

    if (userAgent) {
      message += `<b>🖥️ User Agent:</b> <code>${userAgent}</code>\n`;
    }

    if (error.stack) {
      const stackTrace =
        error.stack.length > 1000
          ? error.stack.substring(0, 1000) + '...'
          : error.stack;
      message += `\n<b>📚 Stack Trace:</b>\n<pre>${stackTrace}</pre>`;
    }

    return message;
  }

  protected static getLevelEmoji(level: string): string {
    const emojiMap: Record<string, string> = {
      success: '✅',
      warning: '⚠️',
      info: 'ℹ️',
      error: '❌',
    };

    return emojiMap[level] || 'ℹ️';
  }
}
