import { EventEmitter } from 'events';
import { AppEvent } from '@/types/core/events.types';

class AppEventEmitter extends EventEmitter {
  emit(eventName: string, event: AppEvent): boolean {
    return super.emit(eventName, event);
  }

  on(eventName: string, listener: (event: AppEvent) => void): this {
    return super.on(eventName, listener);
  }

  once(eventName: string, listener: (event: AppEvent) => void): this {
    return super.once(eventName, listener);
  }
}

export const eventEmitter = new AppEventEmitter();
