import { eventEmitter } from '@/events/event-emitter';
import { ErrorEvent } from '@/types/core/events.types';

export const sendErrorNotification = (
  error: Error | string,
  context?: {
    method?: string;
    url?: string;
    userAgent?: string;
    ip?: string;
    userId?: number;
  },
): void => {
  const isError = error instanceof Error;
  const errorObj = isError ? error : new Error(error);

  const event: ErrorEvent = {
    type: 'error',
    timestamp: new Date(),
    data: {
      error: errorObj,
      method: context?.method ?? 'UNKNOWN',
      url: context?.url ?? 'UNKNOWN',
      environment: process.env.NODE_ENV ?? 'development',
      userAgent: context?.userAgent,
      ip: context?.ip,
      userId: context?.userId,
    },
  };

  eventEmitter.emit('error', event);
};
