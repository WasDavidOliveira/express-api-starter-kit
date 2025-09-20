import { AppError } from '@/exceptions/app.exceptions';
import { ZodError } from 'zod';

/**
 * Tipo para erros específicos do PostgreSQL
 */
export type PostgresError = Error & {
  code?: string;
  detail?: string;
};

/**
 * Tipo para representar um campo com erro de validação
 */
export type ValidationErrorItem = {
  campo: string;
  mensagem: string;
  codigo?: string;
};

/**
 * Union type para todos os tipos de erro tratados pelo error handler
 */
export type ErrorTypes = Error | AppError | PostgresError | ZodError;

export type ErrorResponse = {
  status: 'erro';
  message: string;
  statusCode: number;
  errors?: ValidationErrorItem[];
  campo?: string;
  stack?: string;
  error?: string;
};
