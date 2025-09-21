import { RequestContext } from './core/request-context.types';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      requestContext?: RequestContext;
      sessionID?: string;
    }
  }
}

export {};
