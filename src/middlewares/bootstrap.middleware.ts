import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsConfig } from '@/configs/cors.config';
import { helmetConfig } from '@/configs/helmet.config';
import { globalRateLimiter } from '@/middlewares/rate-limit.middleware';
import router from '@/routes/router';
import {
  errorHandler,
  notFoundHandler,
} from '@/middlewares/error-hander.middleware';
import { ErrorRequestHandler } from 'express';
import { configureDocs } from '@/middlewares/docs.middleware';

export const bootstrapMiddlewares = (app: express.Application) => {
  app.use(cors(corsConfig));

  app.use(helmet(helmetConfig));

  app.use(globalRateLimiter);

  app.use(express.json());

  configureDocs(app);

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler as ErrorRequestHandler);
};
