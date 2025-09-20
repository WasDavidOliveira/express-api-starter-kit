import appConfig from '@/configs/app.config';
import { Environment } from '@/constants/environment.constants';
import { ValidationErrorItem } from '@/types/core/errors.types';

export class AppError extends Error {
  statusCode: number;
  errors?: ValidationErrorItem[];

  constructor(
    message: string,
    statusCode: number = 400,
    errors?: ValidationErrorItem[],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    if (appConfig.nodeEnv !== Environment.PRODUCTION) {
      Error.captureStackTrace(this, this.constructor);
      Object.setPrototypeOf(this, AppError.prototype);
    }
  }
}

export class BadRequestError extends AppError {
  constructor(
    message: string = 'Requisição inválida',
    errors?: ValidationErrorItem[],
  ) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Não autorizado') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acesso negado') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso não encontrado') {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string = 'Erro de validação',
    errors: ValidationErrorItem[] = [],
  ) {
    super(message, 400, errors);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Recurso já existe') {
    super(message, 409);
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string = 'Entidade não processável') {
    super(message, 422);
  }
}
