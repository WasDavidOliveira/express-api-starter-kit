import { onAppEvent } from './event-emitter';
import { AppEvent } from '@/types/core/events.types';

export abstract class BaseEventHandler {
  protected setupEventListeners(): void {
    const eventHandlers = this.getEventHandlers();

    eventHandlers.forEach(({ eventType, handler }) => {
      onAppEvent(eventType, async event => {
        if (event.type === eventType) {
          await handler(event as AppEvent);
        }
      });
    });
  }

  protected abstract getEventHandlers(): Array<{
    eventType: string;
    handler: (event: AppEvent) => Promise<void>;
  }>;
}
