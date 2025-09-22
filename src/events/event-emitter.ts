import { EventEmitter } from 'events';
import { AppEvent } from '@/types/core/events.types';

export const eventEmitter = new EventEmitter();

export const emitAppEvent = (eventName: string, event: AppEvent): boolean => {
  return eventEmitter.emit(eventName, event);
};

export const onAppEvent = (
  eventName: string,
  listener: (event: AppEvent) => void,
): EventEmitter => {
  return eventEmitter.on(eventName, listener);
};

export const onceAppEvent = (
  eventName: string,
  listener: (event: AppEvent) => void,
): EventEmitter => {
  return eventEmitter.once(eventName, listener);
};
