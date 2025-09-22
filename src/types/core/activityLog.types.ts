import { BaseEvent } from '@/types/core/events.types';

export interface ActivityLogEvent extends BaseEvent {
  type: 'activity_log';
  data: {
    userId?: number;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    tableName: string;
    recordId: number;
    oldValues?: Record<string, unknown>;
    newValues?: Record<string, unknown>;
    userAgent?: string;
    ip?: string;
  };
}

export interface CreateActivityLogModel extends Record<string, unknown> {
  userId?: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  tableName: string;
  recordId: number;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  userAgent?: string;
  ip?: string;
}

export interface ActivityLogModel extends CreateActivityLogModel {
  id: number;
  createdAt: Date;
}
