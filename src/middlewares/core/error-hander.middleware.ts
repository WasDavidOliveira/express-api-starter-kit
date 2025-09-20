import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/exceptions/app.exceptions';
import { ZodError } from 'zod';
import { NotFoundError } from '@/exceptions/app.exceptions';
import { StatusCode } from '@/constants/status-code.constants';
import { ValidationErrorItem, ErrorTypes } from '@/types/core/errors.types';
import {
  isPostgresError,
  extractFieldFromDetail,
} from '@/utils/core/error.utils';
import { sendErrorNotification } from '@/events';

export const errorHandler = (
  err: ErrorTypes,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    const errors: ValidationErrorItem[] = err.errors.map(zodError => ({
      campo: String(
        zodError.path[zodError.path.length - 1] ?? zodError.path.join('.'),
      ),
      mensagem: zodError.message,
    }));

    if (process.env.NODE_ENV === 'production') {
      sendErrorNotification(err);
    }

    return res.status(StatusCode.BAD_REQUEST).json({
      status: 'erro',
      message: 'Erro de validação',
      errors,
    });
  }

  if (err instanceof AppError) {
    sendErrorNotification(err);

    return res.status(err.statusCode).json({
      status: 'erro',
      message: err.message,
      ...(err.errors && { errors: err.errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  if (isPostgresError(err)) {
    sendErrorNotification(err);

    if (err.code === '23505') {
      const field = extractFieldFromDetail(err.detail, 'campo');
      return res.status(StatusCode.CONFLICT).json({
        status: 'erro',
        message: `${field} já está em uso`,
        campo: field,
      });
    }

    if (err.code === '23503') {
      const field = extractFieldFromDetail(err.detail, 'registro');

      return res.status(StatusCode.CONFLICT).json({
        status: 'erro',
        message: `${field} não existe`,
        campo: field,
      });
    }
  }

  sendErrorNotification(err);

  return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
    status: 'erro',
    message: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(
    new NotFoundError(`Rota não encontrada: ${req.method} ${req.originalUrl}`),
  );
};
