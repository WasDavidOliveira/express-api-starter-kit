import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsConfig } from '@/configs/cors.config';
import { helmetConfig } from '@/configs/helmet.config';
import { globalRateLimiter } from '@/middlewares/core/rate-limit.middleware';
import router from '@/routes/router';
import {
  errorHandler,
  notFoundHandler,
} from '@/middlewares/core/error-hander.middleware';
import { ErrorRequestHandler } from 'express';
import { configureDocs } from '@/middlewares/core/docs.middleware';

export const bootstrapMiddlewares = (app: express.Application) => {
  app.set('trust proxy', 1);

  app.use(cors(corsConfig));

  app.use(helmet(helmetConfig));

  app.use(globalRateLimiter);

  app.use(express.json());

  configureDocs(app);

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler as ErrorRequestHandler);
};
