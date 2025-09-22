import { Request, Response, NextFunction } from 'express';
import {
  RequestContext,
  RequestContextOptions,
} from '@/types/core/request-context.types';
import { REQUEST_CONTEXT_DEFAULT_OPTIONS } from '@/constants/core/request-context.constants';

export const createRequestContextMiddleware = (
  options: RequestContextOptions = {},
) => {
  const config = { ...REQUEST_CONTEXT_DEFAULT_OPTIONS, ...options };

  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const requestId = req.get('X-Request-ID') ?? config.generateRequestId();

    const context: RequestContext = {
      requestId,
      ip: req.ip ?? req.socket.remoteAddress ?? 'unknown',
      userAgent: req.get('User-Agent'),
      method: req.method,
      url: req.originalUrl ?? req.url,
      timestamp: new Date(),
      startTime,
      sessionId: req.sessionID,
      metadata: {},
    };

    if (config.includeUserInfo && req.userId) {
      context.userId = req.userId;
    }

    if (config.includeMetadata) {
      context.metadata = {
        headers: req.headers,
        query: req.query,
        params: req.params,
        body: req.body,
      };

      const metadataSize = JSON.stringify(context.metadata).length;
      if (metadataSize > config.maxMetadataSize) {
        context.metadata = {
          headers: req.headers,
          query: req.query,
          params: req.params,
          body: '[TRUNCATED]',
        };
      }
    }

    req.requestContext = context;
    res.set('X-Request-ID', requestId);

    next();
  };
};

export const requestContextMiddleware = createRequestContextMiddleware();
