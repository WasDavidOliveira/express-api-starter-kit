import { appConfig } from '@/configs/app.config';
import { DiscordWebhookConfig } from '@/types/core/notification';

export const discordConfig: DiscordWebhookConfig = {
  enabled: appConfig.discord.webhookEnabled,
  url: appConfig.discord.webhookUrl,
  username: appConfig.discord.username,
  avatarUrl: appConfig.discord.avatarUrl,
};
