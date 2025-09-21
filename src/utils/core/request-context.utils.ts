import { Request } from 'express';
import { RequestContext } from '@/types/core/request-context.types';

export const getRequestContext = (req: Request): RequestContext | null => {
  return req.requestContext ?? null;
};

export const getRequestId = (req: Request): string | null => {
  return req.requestContext?.requestId ?? null;
};

export const getUserId = (req: Request): number | null => {
  return req.requestContext?.userId ?? null;
};

export const getSessionId = (req: Request): string | null => {
  return req.requestContext?.sessionId ?? null;
};

export const getRequestMetadata = (req: Request): Record<string, unknown> => {
  return req.requestContext?.metadata ?? {};
};

export const addRequestMetadata = (
  req: Request,
  key: string,
  value: unknown,
): void => {
  if (!req.requestContext) return;

  req.requestContext.metadata[key] = value;
};

export const getRequestDuration = (req: Request): number | null => {
  if (!req.requestContext) return null;

  return Date.now() - req.requestContext.startTime;
};

export const isAuthenticated = (req: Request): boolean => {
  return !!req.requestContext?.userId;
};
