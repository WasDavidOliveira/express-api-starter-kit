import { describe, expect, it, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '@/constants/status-code.constants';
import setupTestDB from '@/tests/hooks/setup-db';
import { faker } from '@faker-js/faker';
import { z } from 'zod';
import {
  AppError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} from '@/exceptions/app.exceptions';
import {
  errorHandler,
  notFoundHandler,
} from '@/middlewares/core/error-hander.middleware';

describe('Error Handler Middleware', () => {
  setupTestDB();

  const createMockRequest = (): Partial<Request> => ({
    method: 'GET',
    originalUrl: '/test',
  });

  const createMockResponse = () => {
    const res: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      headersSent: false,
    };
    return res as Response;
  };

  const createMockNext = (): NextFunction => vi.fn();

  describe('ZodError', () => {
    it('deve tratar erro de validação Zod com múltiplos campos', () => {
      const schema = z.object({
        name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
        email: z.string().email('Email inválido'),
        age: z.number().min(18, 'Idade deve ser maior que 18'),
      });

      const invalidData = {
        name: 'Jo',
        email: 'email-invalido',
        age: 16,
      };

      let zodError: z.ZodError;
      try {
        schema.parse(invalidData);
      } catch (error) {
        zodError = error as z.ZodError;
      }

      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(zodError!, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        status: 'erro',
        message: 'Erro de validação',
        errors: [
          { campo: 'name', mensagem: 'Nome deve ter pelo menos 3 caracteres' },
          { campo: 'email', mensagem: 'Email inválido' },
          { campo: 'age', mensagem: 'Idade deve ser maior que 18' },
        ],
      });
    });

    it('deve tratar erro de validação Zod com campo aninhado', () => {
      const nestedSchema = z.object({
        user: z.object({
          profile: z.object({
            name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
          }),
        }),
      });

      const invalidData = {
        user: {
          profile: {
            name: 'Jo',
          },
        },
      };

      let zodError: z.ZodError;

      try {
        nestedSchema.parse(invalidData);
      } catch (error) {
        zodError = error as z.ZodError;
      }

      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(zodError!, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        status: 'erro',
        message: 'Erro de validação',
        errors: [
          {
            campo: 'name',
            mensagem: 'Nome deve ter pelo menos 3 caracteres',
          },
        ],
      });
    });
  });

  describe('AppError', () => {
    it('deve tratar UnauthorizedError', () => {
      const error = new UnauthorizedError('Usuário não autenticado');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        status: 'erro',
        message: 'Usuário não autenticado',
      });
    });

    it('deve tratar ForbiddenError', () => {
      const error = new ForbiddenError('Acesso negado');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.FORBIDDEN);
      expect(res.json).toHaveBeenCalledWith({
        status: 'erro',
        message: 'Acesso negado',
      });
    });

    it('deve tratar NotFoundError', () => {
      const error = new NotFoundError('Recurso não encontrado');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        status: 'erro',
        message: 'Recurso não encontrado',
      });
    });

    it('deve tratar BadRequestError', () => {
      const error = new BadRequestError('Dados inválidos');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        status: 'erro',
        message: 'Dados inválidos',
      });
    });

    it('deve tratar AppError customizado', () => {
      const error = new AppError(
        'Erro customizado',
        StatusCode.INTERNAL_SERVER_ERROR,
      );
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        status: 'erro',
        message: 'Erro customizado',
      });
    });

    it('deve incluir stack trace em desenvolvimento', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new AppError(
        'Erro customizado',
        StatusCode.INTERNAL_SERVER_ERROR,
      );
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({
        status: 'erro',
        message: 'Erro customizado',
        stack: error.stack,
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('deve incluir errors quando disponível', () => {
      const error = new AppError('Erro com detalhes', StatusCode.BAD_REQUEST);
      error.errors = [{ campo: 'email', mensagem: 'Email inválido' }];

      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        status: 'erro',
        message: 'Erro com detalhes',
        errors: [{ campo: 'email', mensagem: 'Email inválido' }],
      });
    });
  });

  describe('PostgreSQL Errors', () => {
    it('deve tratar erro de violação de chave única', () => {
      const error = new Error(
        'Duplicate key value violates unique constraint',
      ) as Error & { code: string; detail: string };
      error.code = '23505';
      error.detail = 'Key (email)=(test@example.com) already exists.';

      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.CONFLICT);
      expect(res.json).toHaveBeenCalledWith({
        status: 'erro',
        message: 'email já está em uso',
        campo: 'email',
      });
    });

    it('deve tratar erro de violação de chave estrangeira', () => {
      const error = new Error('Foreign key constraint violation') as Error & {
        code: string;
        detail: string;
      };
      error.code = '23503';
      error.detail = 'Key (user_id)=(999) is not present in table "users".';

      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.CONFLICT);
      expect(res.json).toHaveBeenCalledWith({
        status: 'erro',
        message: 'user_id não existe',
        campo: 'user_id',
      });
    });

    it('deve tratar erro de PostgreSQL genérico', () => {
      const error = new Error('Database connection failed') as Error & {
        code: string;
      };
      error.code = '08006';

      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        status: 'erro',
        message: 'Erro interno do servidor',
      });
    });
  });

  describe('Generic Errors', () => {
    it('deve tratar erro genérico', () => {
      const error = new Error('Erro genérico');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        status: 'erro',
        message: 'Erro interno do servidor',
      });
    });

    it('deve incluir detalhes do erro em desenvolvimento', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Erro genérico');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({
        status: 'erro',
        message: 'Erro interno do servidor',
        error: 'Erro genérico',
        stack: error.stack,
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Headers Already Sent', () => {
    it('deve passar erro para próximo handler quando headers já foram enviados', () => {
      const error = new Error('Erro após headers enviados');
      const req = createMockRequest();
      const res = createMockResponse();
      res.headersSent = true;
      const next = createMockNext();

      errorHandler(error, req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('Not Found Handler', () => {
    it('deve retornar 404 para rota não encontrada', () => {
      const req = createMockRequest();
      req.method = 'GET';
      req.originalUrl = '/api/v1/rota-inexistente';
      const res = createMockResponse();
      const next = createMockNext();

      notFoundHandler(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Rota não encontrada: GET /api/v1/rota-inexistente',
        }),
      );
    });

    it('deve incluir método e URL na mensagem de erro', () => {
      const req = createMockRequest();
      req.method = 'POST';
      req.originalUrl = '/api/v1/outra-rota-inexistente';
      const res = createMockResponse();
      const next = createMockNext();

      notFoundHandler(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Rota não encontrada: POST /api/v1/outra-rota-inexistente',
        }),
      );
    });
  });

  describe('Cenários de erro com dados mockados', () => {
    it('deve tratar erro de validação com dados do Faker', () => {
      const schema = z.object({
        name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
        email: z.string().email('Email inválido'),
        age: z.number().min(18, 'Idade deve ser maior que 18'),
      });

      const invalidData = {
        name: faker.string.alphanumeric(2),
        email: faker.string.alphanumeric(10),
        age: faker.number.int({ min: 1, max: 17 }),
      };

      let zodError: z.ZodError;
      try {
        schema.parse(invalidData);
      } catch (error) {
        zodError = error as z.ZodError;
      }

      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(zodError!, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        status: 'erro',
        message: 'Erro de validação',
        errors: expect.arrayContaining([
          expect.objectContaining({ campo: 'name' }),
          expect.objectContaining({ campo: 'email' }),
          expect.objectContaining({ campo: 'age' }),
        ]),
      });
    });

    it('deve tratar erro com mensagem aleatória do Faker', () => {
      const randomMessage = faker.lorem.sentence();
      const error = new Error(randomMessage);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        status: 'erro',
        message: 'Erro interno do servidor',
      });
    });
  });
});
