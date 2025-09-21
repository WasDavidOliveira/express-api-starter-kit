import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsConfig } from '@/configs/cors.config';
import { helmetConfig } from '@/configs/helmet.config';
import { globalRateLimiter } from '@/middlewares/core/rate-limit.middleware';
import { requestContextMiddleware } from '@/middlewares/core/request-context.middleware';
import router from '@/routes/router';
import { errorHandler } from '@/middlewares/core/error-hander.middleware';
import { notFoundHandler } from '@/middlewares/core/not-found.middleware';
import { ErrorRequestHandler } from 'express';
import { configureDocs } from '@/middlewares/core/docs.middleware';

export const bootstrapMiddlewares = (app: express.Application) => {
  app.set('trust proxy', 1);

  app.use(cors(corsConfig));

  app.use(helmet(helmetConfig));

  app.use(globalRateLimiter);

  app.use(express.json());

  app.use(requestContextMiddleware);

  configureDocs(app);

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler as ErrorRequestHandler);
};
