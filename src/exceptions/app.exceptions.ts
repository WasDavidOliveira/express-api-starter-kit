import appConfig from '@/configs/app.config';
import { Environment } from '@/constants/core';
import { ValidationErrorItem } from '@/types/core/errors.types';
import { StatusCode } from '@/constants';

export class AppError extends Error {
  statusCode: number;
  errors?: ValidationErrorItem[];

  constructor(
    message: string,
    statusCode: number = StatusCode.BAD_REQUEST,
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
    super(message, StatusCode.BAD_REQUEST, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Não autorizado') {
    super(message, StatusCode.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acesso negado') {
    super(message, StatusCode.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso não encontrado') {
    super(message, StatusCode.NOT_FOUND);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string = 'Erro de validação',
    errors: ValidationErrorItem[] = [],
  ) {
    super(message, StatusCode.BAD_REQUEST, errors);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Recurso já existe') {
    super(message, StatusCode.CONFLICT);
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string = 'Entidade não processável') {
    super(message, StatusCode.UNPROCESSABLE_ENTITY);
  }
}
