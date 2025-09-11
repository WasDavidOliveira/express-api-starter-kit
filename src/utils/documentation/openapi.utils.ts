import { createDocument } from 'zod-openapi';
import path from 'path';
import fs from 'fs';
import * as z from 'zod';
import {
  loginSchema,
  registerSchema,
  userResponseSchema,
} from '@/validations/v1/modules/auth.validations';

export const generateOpenAPIDocument = () => {
  const loginResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Login realizado com sucesso',
      }),
      user: userResponseSchema,
      token: z.string().openapi({
        description: 'Token JWT para autenticação',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      }),
    })
    .openapi({
      ref: 'LoginResponse',
      description: 'Resposta de login bem-sucedido',
    });

  const registerResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Usuário criado com sucesso',
      }),
      user: userResponseSchema,
    })
    .openapi({
      ref: 'RegisterResponse',
      description: 'Resposta de registro bem-sucedido',
    });

  const meResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Usuário encontrado com sucesso',
      }),
      user: userResponseSchema,
    })
    .openapi({
      ref: 'MeResponse',
      description: 'Resposta com dados do usuário atual',
    });

  const document = createDocument({
    openapi: '3.0.0',
    info: {
      title: 'API Starker Kit',
      description: 'Documentação da API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
    paths: {
      '/api/v1/auth/login': {
        post: {
          tags: ['Autenticação'],
          summary: 'Login de usuário',
          description: 'Endpoint para autenticar um usuário existente',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: loginSchema.shape.body,
              },
            },
          },
          responses: {
            200: {
              description: 'Login realizado com sucesso',
              content: {
                'application/json': {
                  schema: loginResponseSchema,
                },
              },
            },
            400: {
              description: 'Dados inválidos',
            },
            401: {
              description: 'Credenciais inválidas',
            },
          },
        },
      },
      '/api/v1/auth/register': {
        post: {
          tags: ['Autenticação'],
          summary: 'Registro de usuário',
          description: 'Endpoint para cadastrar um novo usuário',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: registerSchema.shape.body,
              },
            },
          },
          responses: {
            200: {
              description: 'Usuário criado com sucesso',
              content: {
                'application/json': {
                  schema: registerResponseSchema,
                },
              },
            },
            400: {
              description: 'Dados inválidos ou usuário já existe',
            },
          },
        },
      },
      '/api/v1/auth/me': {
        get: {
          tags: ['Autenticação'],
          summary: 'Detalhes do usuário atual',
          description: 'Endpoint para obter informações do usuário autenticado',
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: 'Usuário encontrado com sucesso',
              content: {
                'application/json': {
                  schema: meResponseSchema,
                },
              },
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            404: {
              description: 'Usuário não encontrado',
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  });

  const openapiPath = path.resolve(process.cwd(), 'src/docs/openapi.json');
  fs.writeFileSync(openapiPath, JSON.stringify(document, null, 2));

  return document;
};
