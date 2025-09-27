import { ActivityLogEvent } from '@/types/core/activityLog.types';

export interface BaseEvent {
  type: string;
  timestamp: Date;
  data: Record<string, unknown>;
}

export interface ErrorEvent extends BaseEvent {
  type: 'error';
  data: {
    error: Error;
    method: string;
    url: string;
    environment: string;
    userAgent?: string;
    ip?: string;
    userId?: number;
  };
}

export interface NotificationEvent extends BaseEvent {
  type: 'notification';
  data: {
    title: string;
    description: string;
    level: 'success' | 'warning' | 'info' | 'error';
    color?: number;
    stack?: string;
  };
}

export interface WelcomeEvent extends BaseEvent {
  type: 'welcome';
  data: {
    email: string;
    name: string;
  };
}

export type AppEvent = ErrorEvent | NotificationEvent | ActivityLogEvent | WelcomeEvent;
