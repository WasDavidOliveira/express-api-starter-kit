import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/core/app-error.utils';
import { ZodError } from 'zod';
import { NotFoundError } from '@/utils/core/app-error.utils';
import { StatusCode } from '@/constants/status-code.constants';
import { PostgresError, ValidationErrorItem } from '@/types/core/errors.types';

type ErrorTypes = Error | AppError | PostgresError | ZodError;

const isPostgresError = (error: unknown): error is PostgresError => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  
  if (!('code' in error)) {
    return false;
  }

  const code = (error as { code?: unknown }).code;

  return typeof code === 'string';
};

const extractFieldFromDetail = (detail?: string, fallback: string = 'campo'): string => {
  if (!detail) {
    return fallback;
  }
  const match = detail.match(/\((.*?)\)=/);
  const field = match ? match[1] : fallback;
  return field.toLowerCase();
};

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

  if (isPostgresError(err)) {
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
