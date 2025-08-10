import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/core/app-error.utils';
import { ZodError } from 'zod';
import { NotFoundError } from '@/utils/core/app-error.utils';
import { StatusCode } from '@/constants/status-code.constants';
import { PostgresError, ValidationErrorItem } from '@/types/core/errors.types';

type ErrorTypes = Error | AppError | PostgresError | ZodError;

export const errorHandler = (
  err: ErrorTypes,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    const errors: ValidationErrorItem[] = err.errors.map((zodError) => ({
      campo: zodError.path.join('.'),
      mensagem: zodError.message,
    }));

    return res.status(StatusCode.BAD_REQUEST).json({
      status: 'erro',
      message: 'Erro de validação',
      errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'erro',
      message: err.message,
      ...(err.errors && { errors: err.errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  if ('code' in err) {
    if (err.code === '23505') {
      const match = err.detail?.match(/\((.*?)\)=/);
      const field = match ? match[1] : 'campo';

      return res.status(StatusCode.CONFLICT).json({
        status: 'erro',
        message: `${field} já está em uso`,
        campo: field,
      });
    }

    if (err.code === '23503') {
      const match = err.detail?.match(/\((.*?)\)=/);
      const field = match ? match[1].toLowerCase() : 'registro';

      return res.status(StatusCode.CONFLICT).json({
        status: 'erro',
        message: `${field} não existe`,
        campo: field,
      });
    }
  }

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
  next: NextFunction
) => {
  next(
    new NotFoundError(`Rota não encontrada: ${req.method} ${req.originalUrl}`)
  );
};
