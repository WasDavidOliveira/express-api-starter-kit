import { EmailService } from './email.service';
import { BaseEventHandler } from '@/events/core/base-event-handler';
import { AppEvent, WelcomeEvent } from '@/types/core/events.types';

export class EmailEventService extends BaseEventHandler {
  private static instance: EmailEventService | null = null;
  private emailService: EmailService;

  protected constructor() {
    super();
    this.emailService = new EmailService();
    this.setupEventListeners();
  }

  static initialize(): void {
    if (this.instance) {
      return;
    }

    this.instance = new EmailEventService();
  }

  protected getEventHandlers() {
    return [
      {
        eventType: 'welcome',
        handler: async (event: AppEvent) =>
          this.sendWelcomeEmail(event as WelcomeEvent),
      },
    ];
  }

  protected async sendWelcomeEmail(event: WelcomeEvent): Promise<void> {
    if (!this.emailService.isEnabled()) {
      return;
    }

    await this.emailService.sendWelcomeEmail(event.data.email, event.data.name);
  }
}
