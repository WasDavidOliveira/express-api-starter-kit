export interface DiscordWebhookConfig {
  enabled: boolean;
  url: string;
  username: string;
  avatarUrl?: string;
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: DiscordEmbedField[];
  timestamp?: string;
  footer?: {
    text: string;
    icon_url?: string;
  };
}

export interface DiscordWebhookPayload {
  username?: string;
  avatar_url?: string;
  content?: string;
  embeds?: DiscordEmbed[];
}

export interface ErrorNotificationData {
  error: Error;
  method: string;
  url: string;
  timestamp: Date;
  environment: string;
  userAgent?: string;
  ip?: string;
}
