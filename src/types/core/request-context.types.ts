export interface RequestContext {
  requestId: string;
  userId?: number;
  ip: string;
  userAgent?: string;
  method: string;
  url: string;
  timestamp: Date;
  startTime: number;
  sessionId?: string;
  metadata: Record<string, unknown>;
}

export interface RequestContextOptions {
  generateRequestId?: () => string;
  includeUserInfo?: boolean;
  includeMetadata?: boolean;
  maxMetadataSize?: number;
}
