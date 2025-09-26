import { appConfig } from '@/configs/app.config';
import { EmailConfig } from '@/types/core/notification';

export const emailConfig: EmailConfig = {
  enabled: appConfig.email.enabled,
  host: appConfig.email.host,
  port: appConfig.email.port,
  secure: appConfig.email.secure,
  auth: {
    user: appConfig.email.auth.user,
    pass: appConfig.email.auth.pass,
  },
  from: appConfig.email.from,
  fromName: appConfig.email.fromName,
};
