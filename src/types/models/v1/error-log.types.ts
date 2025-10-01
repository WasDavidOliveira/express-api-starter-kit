export interface ErrorLogModel {
  id: number;
  eventType: string;
  serviceName: string;
  errorMessage: string;
  errorStack?: string | null;
  eventData?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
}

export interface CreateErrorLogModel extends Record<string, unknown> {
  eventType: string;
  serviceName: string;
  errorMessage: string;
  errorStack?: string;
  eventData?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}
