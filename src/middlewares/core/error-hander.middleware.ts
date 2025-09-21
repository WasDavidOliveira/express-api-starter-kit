import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/exceptions/app.exceptions';
import { ZodError } from 'zod';
import { StatusCode } from '@/constants/status-code.constants';
import {
  ValidationErrorItem,
  ErrorTypes,
  PostgresError,
  ErrorResponse,
} from '@/types/core/errors.types';
import {
  isPostgresError,
  extractFieldFromDetail,
} from '@/utils/core/error.utils';
import { sendErrorNotification } from '@/events';
import appConfig from '@/configs/app.config';

class ApiErrorHandler {
  protected readonly isDevelopment = appConfig.nodeEnv === 'development';
  protected readonly isProduction = appConfig.nodeEnv === 'production';

  public handle(error: ErrorTypes): ErrorResponse {
    if (error instanceof ZodError) {
      return this.handleZodError(error);
    }

    if (error instanceof AppError) {
      return this.handleAppError(error);
    }

    if (isPostgresError(error)) {
      return this.handlePostgresError(error);
    }

    return this.handleGenericError(error);
  }

  public middleware = (
    err: ErrorTypes,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (res.headersSent) {
      next(err);
      return;
    }

    const errorResponse = this.handle(err);
    res.status(errorResponse.statusCode).json(errorResponse);
  };

  protected handleZodError(error: ZodError): ErrorResponse {
    const errors: ValidationErrorItem[] = error.errors.map(zodError => ({
      campo: String(
        zodError.path[zodError.path.length - 1] ?? zodError.path.join('.'),
      ),
      mensagem: zodError.message,
    }));

    this.notifyError(error, this.isProduction);

    return this.createErrorResponse(
      'Erro de validação',
      StatusCode.BAD_REQUEST,
      { errors },
    );
  }

  protected handleAppError(error: AppError): ErrorResponse {
    this.notifyError(error);

    return this.createErrorResponse(error.message, error.statusCode, {
      errors: error.errors,
      stack: this.isDevelopment ? error.stack : undefined,
    });
  }

  protected handlePostgresError(error: PostgresError): ErrorResponse {
    this.notifyError(error);

    if (error.code === '23505') {
      const field = extractFieldFromDetail(error.detail, 'campo');
      return this.createErrorResponse(
        `${field} já está em uso`,
        StatusCode.CONFLICT,
        { campo: field },
      );
    }

    if (error.code === '23503') {
      const field = extractFieldFromDetail(error.detail, 'registro');
      return this.createErrorResponse(
        `${field} não existe`,
        StatusCode.CONFLICT,
        { campo: field },
      );
    }

    return this.handleGenericError(error);
  }

  protected handleGenericError(error: Error): ErrorResponse {
    this.notifyError(error);

    return this.createErrorResponse(
      'Erro interno do servidor',
      StatusCode.INTERNAL_SERVER_ERROR,
      {
        stack: this.isDevelopment ? error.stack : undefined,
        error: this.isDevelopment ? error.message : undefined,
      },
    );
  }

  protected createErrorResponse(
    message: string,
    statusCode: number,
    options: {
      errors?: ValidationErrorItem[];
      campo?: string;
      stack?: string;
      error?: string;
    } = {},
  ): ErrorResponse {
    return {
      status: 'erro',
      message,
      statusCode,
      ...(options.errors && { errors: options.errors }),
      ...(options.campo && { campo: options.campo }),
      ...(options.stack && { stack: options.stack }),
      ...(options.error && { error: options.error }),
    };
  }

  protected notifyError(error: ErrorTypes, shouldNotify: boolean = true): void {
    if (shouldNotify) {
      sendErrorNotification(error);
    }
  }
}

export const errorHandler = new ApiErrorHandler().middleware;
