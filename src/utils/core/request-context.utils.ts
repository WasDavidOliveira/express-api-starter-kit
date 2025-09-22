import { AsyncLocalStorage } from 'async_hooks';
import { RequestContext } from '@/types/core/request-context.types';

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export const setRequestContext = (context: RequestContext): void => {
  asyncLocalStorage.enterWith(context);
};

export const getRequestContext = (): RequestContext | null => {
  return asyncLocalStorage.getStore() ?? null;
};

export const getRequestId = (): string | null => {
  const context = getRequestContext();
  return context?.requestId ?? null;
};

export const getUserId = (): number | null => {
  const context = getRequestContext();
  return context?.userId ?? null;
};

export const getUserAgent = (): string | null => {
  const context = getRequestContext();
  return context?.userAgent ?? null;
};

export const getIp = (): string | null => {
  const context = getRequestContext();
  return context?.ip ?? null;
};

export const getSessionId = (): string | null => {
  const context = getRequestContext();
  return context?.sessionId ?? null;
};

export const getRequestMetadata = (): Record<string, unknown> => {
  const context = getRequestContext();
  return context?.metadata ?? {};
};

export const getRequestDuration = (): number | null => {
  const context = getRequestContext();
  if (!context) return null;

  return Date.now() - context.startTime;
};

export const isAuthenticated = (): boolean => {
  const context = getRequestContext();
  return !!context?.userId;
};
