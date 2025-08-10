import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

export const loginSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: 'Email é obrigatório' })
        .email('Email inválido')
        .openapi({
          description: 'Email do usuário',
          example: 'usuario@exemplo.com',
        }),
      password: z
        .string({ required_error: 'Senha é obrigatória' })
        .min(6, 'A senha deve ter no mínimo 6 caracteres')
        .openapi({
          description: 'Senha do usuário',
          example: 'senha123',
          format: 'password',
        }),
    })
    .openapi({
      ref: 'LoginInput',
      description: 'Dados para autenticação de usuário',
    }),
});

export const registerSchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: 'Nome é obrigatório' })
        .min(3, 'O nome deve ter no mínimo 3 caracteres')
        .openapi({
          description: 'Nome do usuário',
          example: 'João Silva',
        }),
      email: z
        .string({ required_error: 'Email é obrigatório' })
        .email('Email inválido')
        .openapi({
          description: 'Email do usuário',
          example: 'usuario@exemplo.com',
        }),
      password: z
        .string({ required_error: 'Senha é obrigatória' })
        .min(6, 'A senha deve ter no mínimo 6 caracteres')
        .openapi({
          description: 'Senha do usuário',
          example: 'senha123',
          format: 'password',
        }),
    })
    .openapi({
      ref: 'RegisterInput',
      description: 'Dados para criação de um novo usuário',
    }),
});

export const userResponseSchema = z
  .object({
    id: z.number().openapi({
      description: 'ID único do usuário',
      example: 1,
    }),
    name: z.string().openapi({
      description: 'Nome do usuário',
      example: 'João Silva',
    }),
    email: z.string().email().openapi({
      description: 'Email do usuário',
      example: 'usuario@exemplo.com',
    }),
  })
  .openapi({
    ref: 'User',
    description: 'Informações do usuário',
  });

export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RegisterInput = z.infer<typeof registerSchema>['body'];
