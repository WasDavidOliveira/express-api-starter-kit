import { ErrorLogRepository } from '@/repositories/v1/analytics/error-log.repository';
import { AppEvent } from '@/types/core/events.types';

export class EventErrorWrapper {
  protected errorLogRepository: ErrorLogRepository;

  constructor() {
    this.errorLogRepository = new ErrorLogRepository();
  }

  async wrapEventHandler<T extends AppEvent>(
    eventType: string,
    serviceName: string,
    handler: (event: T) => Promise<void>,
    event: T,
  ): Promise<void> {
    const result = await Promise.allSettled([handler(event)]);
    const [handlerResult] = result;

    if (handlerResult.status === 'rejected') {
      await this.logError(eventType, serviceName, handlerResult.reason, event);
    }
  }

  protected async logError(
    eventType: string,
    serviceName: string,
    error: unknown,
    eventData: AppEvent,
  ): Promise<void> {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    await this.errorLogRepository.create({
      eventType,
      serviceName,
      errorMessage,
      errorStack,
      eventData: eventData as unknown as Record<string, unknown>,
      metadata: {
        timestamp: new Date().toISOString(),
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      },
    });
  }
}
