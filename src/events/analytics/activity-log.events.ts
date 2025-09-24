import { emitAppEvent } from '@/events/core/event-emitter';
import { ActivityLogEvent } from '@/types/core/activityLog.types';

export const emitActivityLogEvent = (
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  tableName: string,
  recordId: number,
  options?: {
    userId?: number;
    oldValues?: Record<string, unknown>;
    newValues?: Record<string, unknown>;
    userAgent?: string;
    ip?: string;
  },
): void => {
  const event: ActivityLogEvent = {
    type: 'activity_log',
    timestamp: new Date(),
    data: {
      action,
      tableName,
      recordId,
      userId: options?.userId,
      oldValues: options?.oldValues,
      newValues: options?.newValues,
      userAgent: options?.userAgent,
      ip: options?.ip,
    },
  };

  emitAppEvent('activity_log', event);
};

export const emitCreateEvent = (
  tableName: string,
  recordId: number,
  newValues: Record<string, unknown>,
  options?: {
    userId?: number;
    userAgent?: string;
    ip?: string;
  },
): void => {
  emitActivityLogEvent('CREATE', tableName, recordId, {
    ...options,
    newValues,
  });
};

export const emitUpdateEvent = (
  tableName: string,
  recordId: number,
  oldValues: Record<string, unknown>,
  newValues: Record<string, unknown>,
  options?: {
    userId?: number;
    userAgent?: string;
    ip?: string;
  },
): void => {
  emitActivityLogEvent('UPDATE', tableName, recordId, {
    ...options,
    oldValues,
    newValues,
  });
};

export const emitDeleteEvent = (
  tableName: string,
  recordId: number,
  oldValues: Record<string, unknown>,
  options?: {
    userId?: number;
    userAgent?: string;
    ip?: string;
  },
): void => {
  emitActivityLogEvent('DELETE', tableName, recordId, {
    ...options,
    oldValues,
  });
};
