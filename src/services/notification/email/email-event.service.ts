import { EmailService } from './email.service';
import { onAppEvent } from '@/events';
import { WelcomeEvent } from '@/types/core/events.types';

export class EmailEventService {
  private static instance: EmailEventService | null = null;
  private emailService: EmailService;

  protected constructor() {
    this.emailService = new EmailService();
    this.setupListeners();
  }

  static initialize(): void {
    if (this.instance) {
      return;
    }

    this.instance = new EmailEventService();
  }

  protected setupListeners(): void {
    onAppEvent('welcome', async event => {
      if (event.type === 'welcome') {
        await this.sendWelcomeEmail(event as WelcomeEvent);
      }
    });
  }

  protected async sendWelcomeEmail(event: WelcomeEvent): Promise<void> {
    if (!this.emailService.isEnabled()) {
      return;
    }

    await this.emailService.sendWelcomeEmail(
      event.data.email,
      event.data.name
    );
  }
}
