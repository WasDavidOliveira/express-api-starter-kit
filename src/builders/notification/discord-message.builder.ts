import { ErrorEvent, NotificationEvent } from '@/types/core/events.types';
import { DiscordEmbed } from '@/types/core/notification/discord.types';
import {
  NOTIFICATION_LEVEL_COLORS,
  NOTIFICATION_LEVEL_EMOJIS,
  ERROR_TYPE_COLORS,
} from '@/constants/notification';

export class DiscordMessageBuilder {
  static createErrorEmbed(event: ErrorEvent): DiscordEmbed {
    const { error, method, url, environment, userAgent, ip, userId } =
      event.data;

    const timestamp = event.timestamp.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const statusEmoji = this.getErrorStatusEmoji(error.name);
    const environmentEmoji = this.getEnvironmentEmoji(environment);
    const severity = this.getErrorSeverity(error.name);

    return {
      title: `${statusEmoji} **${error.name}**`,
      description: `\`\`\`\n${error.message}\`\`\``,
      color: this.getErrorColor(error.name),
      fields: [
        {
          name: '**📋 Detalhes**',
          value: [
            `**Endpoint:** \`${method} ${url}\``,
            `**Severidade:** \`${severity}\``,
            `**Ambiente:** ${environmentEmoji} \`${environment.toUpperCase()}\``,
            `**Horário:** \`${timestamp}\``,
            userId ? `**Usuário:** \`${userId}\`` : null,
          ]
            .filter(Boolean)
            .join('\n\n'),
          inline: false,
        },
        {
          name: '**🌐 Cliente**',
          value: [
            ip ? `**IP:** \`${ip}\`` : '**IP:** `N/A`',
            userAgent
              ? `**Browser:** \`${this.formatUserAgent(userAgent)}\``
              : '**Browser:** `N/A`',
          ].join('\n\n'),
          inline: true,
        },
        {
          name: '**🔧 Stack Trace**',
          value: `\`\`\`javascript\n${this.formatStackTrace(error.stack)}\`\`\``,
          inline: false,
        },
      ],
      timestamp: event.timestamp.toISOString(),
      footer: {
        text: 'Sistema de Monitoramento • Express API',
      },
    };
  }

  static createNotificationEmbed(event: NotificationEvent): DiscordEmbed {
    const { title, description, level, color, stack } = event.data;

    const embed: DiscordEmbed = {
      title: `${NOTIFICATION_LEVEL_EMOJIS[level]} ${title}`,
      description,
      color: color ?? NOTIFICATION_LEVEL_COLORS[level],
      timestamp: event.timestamp.toISOString(),
      footer: {
        text: 'Sistema de Notificações',
      },
    };

    if (stack) {
      embed.fields = [
        {
          name: 'Stack Trace',
          value: `\`\`\`\n${stack.substring(0, 1000)}\n\`\`\``,
          inline: false,
        },
      ];
    }

    return embed;
  }

  private static getErrorStatusEmoji(errorName: string): string {
    const errorMap: Record<string, string> = {
      ValidationError: '⚠️',
      TypeError: '🔧',
      ReferenceError: '🔍',
      SyntaxError: '📝',
      NetworkError: '🌐',
      DatabaseError: '🗄️',
      AuthenticationError: '🔐',
      AuthorizationError: '🚫',
      NotFoundError: '❌',
      TimeoutError: '⏱️',
      RateLimitError: '🚦',
      InternalServerError: '💥',
    };
    return errorMap[errorName] ?? '🐛';
  }

  private static getEnvironmentEmoji(environment: string): string {
    const envMap: Record<string, string> = {
      development: '🛠️',
      production: '🚀',
      staging: '🧪',
      test: '🧪',
    };
    return envMap[environment.toLowerCase()] ?? '❓';
  }

  private static getErrorColor(errorName: string): number {
    return (
      ERROR_TYPE_COLORS[errorName as keyof typeof ERROR_TYPE_COLORS] ??
      NOTIFICATION_LEVEL_COLORS.error
    );
  }

  private static colorizeError(errorName: string): string {
    const colorMap: Record<string, string> = {
      ValidationError: '\x1b[33m', // Yellow
      TypeError: '\x1b[31m', // Red
      ReferenceError: '\x1b[31m', // Red
      SyntaxError: '\x1b[31m', // Red
      NetworkError: '\x1b[36m', // Cyan
      DatabaseError: '\x1b[31m', // Red
      AuthenticationError: '\x1b[33m', // Yellow
      AuthorizationError: '\x1b[31m', // Red
      NotFoundError: '\x1b[37m', // White
      TimeoutError: '\x1b[33m', // Yellow
      RateLimitError: '\x1b[33m', // Yellow
      InternalServerError: '\x1b[31m', // Red
    };
    const color = colorMap[errorName] ?? '\x1b[31m';
    return `${color}${errorName}\x1b[0m`;
  }

  private static formatStackTrace(stack?: string): string {
    if (!stack) return 'Stack trace não disponível';

    const lines = stack.split('\n');
    const formattedLines = lines
      .slice(0, 5) // Reduzir para 5 linhas
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.includes('node_modules'))
      .map(line => this.highlightImportantLines(line));

    return formattedLines.join('\n');
  }

  private static getErrorSeverity(errorName: string): string {
    const severityMap: Record<string, string> = {
      ValidationError: 'MÉDIA',
      TypeError: 'ALTA',
      ReferenceError: 'ALTA',
      SyntaxError: 'CRÍTICA',
      NetworkError: 'MÉDIA',
      DatabaseError: 'CRÍTICA',
      AuthenticationError: 'ALTA',
      AuthorizationError: 'ALTA',
      NotFoundError: 'BAIXA',
      TimeoutError: 'MÉDIA',
      RateLimitError: 'BAIXA',
      InternalServerError: 'CRÍTICA',
    };
    return severityMap[errorName] ?? 'DESCONHECIDA';
  }

  private static getErrorCategory(errorName: string): string {
    const categoryMap: Record<string, string> = {
      ValidationError: 'Validação de Dados',
      TypeError: 'Erro de Tipo',
      ReferenceError: 'Erro de Referência',
      SyntaxError: 'Erro de Sintaxe',
      NetworkError: 'Rede/Conectividade',
      DatabaseError: 'Banco de Dados',
      AuthenticationError: 'Autenticação',
      AuthorizationError: 'Autorização',
      NotFoundError: 'Recurso Não Encontrado',
      TimeoutError: 'Timeout',
      RateLimitError: 'Limite de Taxa',
      InternalServerError: 'Erro Interno',
    };
    return categoryMap[errorName] ?? 'Desconhecida';
  }

  private static formatUserAgent(userAgent: string): string {
    if (!userAgent) return 'N/A';

    // Extrair informações básicas do User Agent
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent);
    const isFirefox = /Firefox/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !isChrome;

    let browser = 'Unknown';
    if (isChrome) browser = 'Chrome';
    else if (isFirefox) browser = 'Firefox';
    else if (isSafari) browser = 'Safari';

    const device = isMobile ? 'Mobile' : 'Desktop';

    return `${browser} (${device})`;
  }

  private static getRequestOrigin(url: string): string {
    try {
      const urlObj = new URL(url, 'http://localhost');
      return urlObj.pathname.split('/')[1] ?? 'root';
    } catch {
      return 'unknown';
    }
  }

  private static getDeviceType(userAgent?: string): string {
    if (!userAgent) return 'Unknown';

    if (/Mobile|Android|iPhone/.test(userAgent)) return 'Mobile';
    if (/iPad|Tablet/.test(userAgent)) return 'Tablet';
    if (/Windows/.test(userAgent)) return 'Windows';
    if (/Mac/.test(userAgent)) return 'Mac';
    if (/Linux/.test(userAgent)) return 'Linux';

    return 'Desktop';
  }

  private static getRecommendedActions(
    errorName: string,
    _message: string,
  ): string {
    const actions: Record<string, string[]> = {
      ValidationError: [
        '✅ Verificar dados de entrada',
        '✅ Validar schema de dados',
        '✅ Implementar validação no frontend',
      ],
      AuthenticationError: [
        '🔐 Verificar token de autenticação',
        '🔐 Implementar refresh token',
        '🔐 Melhorar tratamento de sessão',
      ],
      DatabaseError: [
        '🗄️ Verificar conexão com banco',
        '🗄️ Analisar queries SQL',
        '🗄️ Implementar retry logic',
      ],
      NetworkError: [
        '🌐 Verificar conectividade',
        '🌐 Implementar timeout adequado',
        '🌐 Adicionar retry automático',
      ],
      InternalServerError: [
        '💥 Verificar logs detalhados',
        '💥 Implementar graceful degradation',
        '💥 Notificar equipe de desenvolvimento',
      ],
    };

    const defaultActions = [
      '📝 Revisar logs de erro',
      '🔍 Investigar causa raiz',
      '📞 Notificar equipe técnica',
    ];

    const recommendedActions = actions[errorName] ?? defaultActions;

    return recommendedActions.map(action => `• ${action}`).join('\n');
  }

  private static getErrorThumbnail(errorName: string): string {
    const thumbnailMap: Record<string, string> = {
      ValidationError: 'https://cdn.discordapp.com/emojis/⚠️.png',
      TypeError: 'https://cdn.discordapp.com/emojis/🔧.png',
      ReferenceError: 'https://cdn.discordapp.com/emojis/🔍.png',
      SyntaxError: 'https://cdn.discordapp.com/emojis/📝.png',
      NetworkError: 'https://cdn.discordapp.com/emojis/🌐.png',
      DatabaseError: 'https://cdn.discordapp.com/emojis/🗄️.png',
      AuthenticationError: 'https://cdn.discordapp.com/emojis/🔐.png',
      AuthorizationError: 'https://cdn.discordapp.com/emojis/🚫.png',
      NotFoundError: 'https://cdn.discordapp.com/emojis/❌.png',
      TimeoutError: 'https://cdn.discordapp.com/emojis/⏱️.png',
      RateLimitError: 'https://cdn.discordapp.com/emojis/🚦.png',
      InternalServerError: 'https://cdn.discordapp.com/emojis/💥.png',
    };
    return (
      thumbnailMap[errorName] ?? 'https://cdn.discordapp.com/emojis/❓.png'
    );
  }

  private static highlightImportantLines(line: string): string {
    // Destacar linhas importantes no stack trace
    if (line.includes('Error:')) {
      return `🔴 ${line}`;
    }
    if (line.includes('at ') && line.includes('(')) {
      return `   ${line}`;
    }
    return `   ${line}`;
  }
}
