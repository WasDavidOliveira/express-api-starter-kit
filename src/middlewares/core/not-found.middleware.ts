import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '@/exceptions/app.exceptions';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(
    new NotFoundError(`Rota não encontrada: ${req.method} ${req.originalUrl}`),
  );
};
