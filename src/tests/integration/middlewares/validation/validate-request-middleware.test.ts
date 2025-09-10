import { describe, expect, it, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '@/constants/status-code.constants';
import setupTestDB from '@/tests/hooks/setup-db';
import { faker } from '@faker-js/faker';
import { z } from 'zod';
import { validateRequest } from '@/middlewares/validation/validate-request.middlewares';

describe('Validate Request Middleware', () => {
  setupTestDB();

  const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
    body: {},
    query: {},
    params: {},
    ...overrides,
  });

  const createMockResponse = () => {
    const res: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    return res as Response;
  };

  const createMockNext = (): NextFunction => vi.fn();

  describe('Validação de Body', () => {
    it('deve permitir requisição com body válido', () => {
      const schema = z.object({
        body: z.object({
          name: z.string().min(3),
          email: z.string().email(),
          age: z.number().min(18),
        }),
      });

      const req = createMockRequest({
        body: {
          name: 'João Silva',
          email: 'joao@example.com',
          age: 25,
        },
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('deve rejeitar requisição com body inválido', () => {
      const schema = z.object({
        body: z.object({
          name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
          email: z.string().email('Email inválido'),
          age: z.number().min(18, 'Idade deve ser maior que 18'),
        }),
      });

      const req = createMockRequest({
        body: {
          name: 'Jo',
          email: 'email-invalido',
          age: 16,
        },
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Dados inválidos na requisição',
        errors: [
          { campo: 'name', mensagem: 'Nome deve ter pelo menos 3 caracteres' },
          { campo: 'email', mensagem: 'Email inválido' },
          { campo: 'age', mensagem: 'Idade deve ser maior que 18' },
        ],
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve rejeitar requisição com campos obrigatórios ausentes', () => {
      const schema = z.object({
        body: z.object({
          name: z.string().min(1, 'Nome é obrigatório'),
          email: z.string().email('Email é obrigatório'),
        }),
      });

      const req = createMockRequest({
        body: {},
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Dados inválidos na requisição',
        errors: [
          { campo: 'name', mensagem: 'Required' },
          { campo: 'email', mensagem: 'Required' },
        ],
      });
    });
  });

  describe('Validação de Query', () => {
    it('deve permitir requisição com query válida', () => {
      const schema = z.object({
        query: z.object({
          page: z.string().transform(Number).pipe(z.number().min(1)),
          limit: z.string().transform(Number).pipe(z.number().min(1).max(100)),
          search: z.string().optional(),
        }),
      });

      const req = createMockRequest({
        query: {
          page: '1',
          limit: '10',
          search: 'teste',
        },
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve rejeitar requisição com query inválida', () => {
      const schema = z.object({
        query: z.object({
          page: z.string().transform(Number).pipe(z.number().min(1, 'Página deve ser maior que 0')),
          limit: z.string().transform(Number).pipe(z.number().min(1).max(100, 'Limite deve ser entre 1 e 100')),
        }),
      });

      const req = createMockRequest({
        query: {
          page: '0',
          limit: '150',
        },
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Dados inválidos na requisição',
        errors: [
          { campo: 'page', mensagem: 'Página deve ser maior que 0' },
          { campo: 'limit', mensagem: 'Limite deve ser entre 1 e 100' },
        ],
      });
    });
  });

  describe('Validação de Params', () => {
    it('deve permitir requisição com params válidos', () => {
      const schema = z.object({
        params: z.object({
          id: z.string().uuid('ID deve ser um UUID válido'),
          userId: z.string().uuid('User ID deve ser um UUID válido'),
        }),
      });

      const req = createMockRequest({
        params: {
          id: faker.string.uuid(),
          userId: faker.string.uuid(),
        },
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve rejeitar requisição com params inválidos', () => {
      const schema = z.object({
        params: z.object({
          id: z.string().uuid('ID deve ser um UUID válido'),
          userId: z.string().uuid('User ID deve ser um UUID válido'),
        }),
      });

      const req = createMockRequest({
        params: {
          id: 'invalid-uuid',
          userId: 'another-invalid-uuid',
        },
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Dados inválidos na requisição',
        errors: [
          { campo: 'id', mensagem: 'ID deve ser um UUID válido' },
          { campo: 'userId', mensagem: 'User ID deve ser um UUID válido' },
        ],
      });
    });
  });

  describe('Validação Combinada', () => {
    it('deve permitir requisição com body, query e params válidos', () => {
      const schema = z.object({
        body: z.object({
          name: z.string().min(3),
          email: z.string().email(),
        }),
        query: z.object({
          page: z.string().transform(Number).pipe(z.number().min(1)),
        }),
        params: z.object({
          id: z.string().uuid(),
        }),
      });

      const req = createMockRequest({
        body: {
          name: 'João Silva',
          email: 'joao@example.com',
        },
        query: {
          page: '1',
        },
        params: {
          id: faker.string.uuid(),
        },
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve rejeitar requisição com múltiplos erros em diferentes seções', () => {
      const schema = z.object({
        body: z.object({
          name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
          email: z.string().email('Email inválido'),
        }),
        query: z.object({
          page: z.string().transform(Number).pipe(z.number().min(1, 'Página inválida')),
        }),
        params: z.object({
          id: z.string().uuid('ID inválido'),
        }),
      });

      const req = createMockRequest({
        body: {
          name: 'Jo',
          email: 'email-invalido',
        },
        query: {
          page: '0',
        },
        params: {
          id: 'invalid-uuid',
        },
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Dados inválidos na requisição',
        errors: [
          { campo: 'name', mensagem: 'Nome deve ter pelo menos 3 caracteres' },
          { campo: 'email', mensagem: 'Email inválido' },
          { campo: 'page', mensagem: 'Página inválida' },
          { campo: 'id', mensagem: 'ID inválido' },
        ],
      });
    });
  });

  describe('Validação Aninhada', () => {
    it('deve tratar campos aninhados corretamente', () => {
      const schema = z.object({
        body: z.object({
          user: z.object({
            profile: z.object({
              name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
              address: z.object({
                street: z.string().min(1, 'Rua é obrigatória'),
                city: z.string().min(1, 'Cidade é obrigatória'),
              }),
            }),
          }),
        }),
      });

      const req = createMockRequest({
        body: {
          user: {
            profile: {
              name: 'Jo',
              address: {
                street: '',
                city: '',
              },
            },
          },
        },
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Dados inválidos na requisição',
        errors: [
          { campo: 'name', mensagem: 'Nome deve ter pelo menos 3 caracteres' },
          { campo: 'street', mensagem: 'Rua é obrigatória' },
          { campo: 'city', mensagem: 'Cidade é obrigatória' },
        ],
      });
    });
  });

  describe('Tratamento de Erros Não-Zod', () => {
    it('deve passar erro para próximo middleware quando não for ZodError', () => {
      const mockSchema = {
        parse: vi.fn().mockImplementation(() => {
          throw new Error('Erro não-Zod');
        }),
      };

      const req = createMockRequest({
        body: { name: 'João' },
      });

      const res = createMockResponse();
      const next = vi.fn();

      const middleware = validateRequest(mockSchema as unknown as import('zod').AnyZodObject);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('Cenários com Faker', () => {
    it('deve permitir requisição com dados válidos do Faker', () => {
      const schema = z.object({
        body: z.object({
          name: z.string().min(3),
          email: z.string().email(),
          age: z.number().min(18).max(100),
          phone: z.string().regex(/^\d{10,11}$/, 'Telefone deve ter 10 ou 11 dígitos'),
        }),
      });

      const req = createMockRequest({
        body: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          age: faker.number.int({ min: 18, max: 100 }),
          phone: faker.string.numeric(10),
        },
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve rejeitar requisição com dados inválidos do Faker', () => {
      const schema = z.object({
        body: z.object({
          name: z.string().min(10, 'Nome deve ter pelo menos 10 caracteres'),
          email: z.string().email('Email inválido'),
          age: z.number().min(25, 'Idade deve ser maior que 25'),
        }),
      });

      const req = createMockRequest({
        body: {
          name: faker.string.alphanumeric(5),
          email: faker.string.alphanumeric(10),
          age: faker.number.int({ min: 18, max: 24 }),
        },
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Dados inválidos na requisição',
        errors: [
          { campo: 'name', mensagem: 'Nome deve ter pelo menos 10 caracteres' },
          { campo: 'email', mensagem: 'Email inválido' },
          { campo: 'age', mensagem: 'Idade deve ser maior que 25' },
        ],
      });
    });

    it('deve validar array de objetos com Faker', () => {
      const schema = z.object({
        body: z.object({
          users: z.array(
            z.object({
              name: z.string().min(3),
              email: z.string().email(),
            })
          ).min(1, 'Deve ter pelo menos um usuário'),
        }),
      });

      const req = createMockRequest({
        body: {
          users: [
            {
              name: faker.person.fullName(),
              email: faker.internet.email(),
            },
            {
              name: faker.person.fullName(),
              email: faker.internet.email(),
            },
          ],
        },
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve rejeitar array vazio com Faker', () => {
      const schema = z.object({
        body: z.object({
          users: z.array(
            z.object({
              name: z.string().min(3),
              email: z.string().email(),
            })
          ).min(1, 'Deve ter pelo menos um usuário'),
        }),
      });

      const req = createMockRequest({
        body: {
          users: [],
        },
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Dados inválidos na requisição',
        errors: [
          { campo: 'users', mensagem: 'Deve ter pelo menos um usuário' },
        ],
      });
    });
  });

  describe('Casos Especiais', () => {
    it('deve tratar campos opcionais corretamente', () => {
      const schema = z.object({
        body: z.object({
          name: z.string().min(3),
          email: z.string().email(),
          phone: z.string().optional(),
          address: z.string().optional(),
        }),
      });

      const req = createMockRequest({
        body: {
          name: 'João Silva',
          email: 'joao@example.com',
        },
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve tratar transformações de dados', () => {
      const schema = z.object({
        body: z.object({
          age: z.string().transform(Number).pipe(z.number().min(18)),
          isActive: z.string().transform((val) => val === 'true'),
        }),
      });

      const req = createMockRequest({
        body: {
          age: '25',
          isActive: 'true',
        },
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve rejeitar transformação inválida', () => {
      const schema = z.object({
        body: z.object({
          age: z.string().transform(Number).pipe(z.number().min(18, 'Idade deve ser maior que 18')),
        }),
      });

      const req = createMockRequest({
        body: {
          age: 'invalid-number',
        },
      });

      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Dados inválidos na requisição',
        errors: expect.arrayContaining([
          expect.objectContaining({
            campo: 'age',
            mensagem: expect.any(String),
          }),
        ]),
      });
    });
  });
});
