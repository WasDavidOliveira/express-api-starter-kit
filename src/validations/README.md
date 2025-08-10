# Validations da API

Esta pasta contém os esquemas de validação utilizados pela aplicação para garantir a integridade e conformidade dos dados de entrada. As validações são implementadas usando a biblioteca **Zod** com extensão **OpenAPI**, oferecendo uma forma tipada, expressiva e documentada de validar dados.

## Conceito

Os esquemas de validação definem a estrutura e as regras que os dados de entrada devem seguir antes de serem processados pela aplicação. Eles:

- **Garantem** que os dados tenham a estrutura correta
- **Definem** tipos e formatos esperados para cada campo
- **Aplicam** regras de negócio em nível de dados
- **Fornecem** mensagens de erro claras e específicas
- **Transformam** dados de entrada quando necessário
- **Integram** com OpenAPI para documentação automática
- **Geram** tipos TypeScript automaticamente

## Estrutura da Pasta

```
validations/
├── README.md                    # Esta documentação
├── v1/                         # Versão 1 da API
│   └── modules/                # Módulos organizados por domínio
│       ├── auth.validations.ts # Validações de autenticação
│       ├── role.validations.ts # Validações de roles
│       ├── permission.validations.ts # Validações de permissões
│       └── index.ts            # Exportação centralizada dos módulos
└── index.ts                    # Exportação centralizada de todas as validações
```

## Módulos Disponíveis

### 🔐 **Auth Module** (`v1/modules/auth.validations.ts`)
Validações para autenticação e gerenciamento de usuários:

- **`loginSchema`**: Validação para login de usuário
  - `email`: Email obrigatório e válido
  - `password`: Senha obrigatória com mínimo de 6 caracteres
- **`registerSchema`**: Validação para registro de usuário
  - `name`: Nome obrigatório com mínimo de 3 caracteres
  - `email`: Email obrigatório e válido
  - `password`: Senha obrigatória com mínimo de 6 caracteres
- **`userResponseSchema`**: Schema de resposta para usuários
  - `id`: ID numérico do usuário
  - `name`: Nome do usuário
  - `email`: Email do usuário

### 🎭 **Role Module** (`v1/modules/role.validations.ts`)
Validações para gerenciamento de roles:

- **`createRoleSchema`**: Validação para criação de role
  - `name`: Nome obrigatório da role
  - `description`: Descrição obrigatória da role
- **`updateRoleSchema`**: Validação para atualização de role
  - `name`: Nome obrigatório da role
  - `description`: Descrição obrigatória da role

### 🔑 **Permission Module** (`v1/modules/permission.validations.ts`)
Validações para gerenciamento de permissões:

- **`createPermissionSchema`**: Validação para criação de permissão
  - `name`: Nome obrigatório da permissão
  - `description`: Descrição obrigatória da permissão
  - `action`: Ação obrigatória (enum: CREATE, READ, UPDATE, DELETE, MANAGE)
- **`updatePermissionSchema`**: Validação para atualização de permissão
  - `name`: Nome obrigatório da permissão
  - `description`: Descrição obrigatória da permissão
  - `action`: Ação obrigatória (enum: CREATE, READ, UPDATE, DELETE, MANAGE)

## Responsabilidades

Os esquemas de validação são responsáveis por:

- **Definir** a estrutura esperada dos objetos
- **Validar** tipos primitivos (string, number, boolean, etc.)
- **Aplicar** regras de validação (min, max, regex, etc.)
- **Transformar** dados entre formatos
- **Definir** mensagens de erro personalizadas
- **Implementar** validações condicionais
- **Reutilizar** validações comuns
- **Integrar** com OpenAPI para documentação
- **Gerar** tipos TypeScript automaticamente

## Implementação com Zod + OpenAPI

### Configuração Base
```typescript
import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

// Estende Zod com funcionalidades OpenAPI
extendZodWithOpenApi(z);
```

### Schema de Login
```typescript
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
```

### Schema de Registro
```typescript
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
```

### Schema de Resposta de Usuário
```typescript
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
```

### Schema de Role
```typescript
export const createRoleSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'O nome da role é obrigatório'),
    description: z.string().min(1, 'A descrição da role é obrigatória'),
  }),
});

export const updateRoleSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'O nome da role é obrigatório'),
    description: z.string().min(1, 'A descrição da role é obrigatória'),
  }),
});
```

### Schema de Permissão
```typescript
import { PermissionActions } from '@/constants/permission.constants';

export const createPermissionSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'O nome da permissão é obrigatório'),
    description: z.string().min(1, 'A descrição da permissão é obrigatória'),
    action: z.nativeEnum(PermissionActions),
  }),
});

export const updatePermissionSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'O nome da permissão é obrigatório'),
    description: z.string().min(1, 'A descrição da permissão é obrigatória'),
    action: z.nativeEnum(PermissionActions),
  }),
});
```

## Tipos TypeScript Gerados

### Tipos de Entrada
```typescript
// Tipos inferidos automaticamente dos schemas
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type CreateRoleInput = z.infer<typeof createRoleSchema>['body'];
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>['body'];
export type CreatePermissionInput = z.infer<typeof createPermissionSchema>['body'];
export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>['body'];
```

### Tipos de Resposta
```typescript
// Tipos para respostas da API
export type UserResponse = z.infer<typeof userResponseSchema>;
```

## Constantes de Permissão

### Enum de Ações
```typescript
// src/constants/permission.constants.ts
export const PermissionActions = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
} as const;

export type PermissionAction =
  (typeof PermissionActions)[keyof typeof PermissionActions];
```

### Uso em Validações
```typescript
import { PermissionActions } from '@/constants/permission.constants';

// Validação com enum nativo
action: z.nativeEnum(PermissionActions)
```

## Integração com Middlewares

Os esquemas de validação são utilizados pelo middleware de validação:

```typescript
// Em uma rota
import { validateRequest } from '@/middlewares/validate-request.middlewares';
import { createUserSchema } from '@/validations/v1/modules/auth.validations';

router.post('/users', validateRequest(createUserSchema), userController.createUser);
```

## Integração com OpenAPI

### Geração Automática de Documentação
```typescript
// src/utils/documentation/openapi.utils.ts
import {
  loginSchema,
  registerSchema,
  userResponseSchema,
} from '@/validations/v1/modules/auth.validations';

export const generateOpenAPIDocument = () => {
  const document = createDocument({
    openapi: '3.0.0',
    info: {
      title: 'API Starker Kit',
      description: 'Documentação da API',
      version: '1.0.0',
    },
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
            '200': {
              description: 'Login realizado com sucesso',
              content: {
                'application/json': {
                  schema: loginResponseSchema,
                },
              },
            },
            '400': {
              description: 'Dados inválidos',
            },
            '401': {
              description: 'Credenciais inválidas',
            },
          },
        },
      },
      // ... outros endpoints
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

  return document;
};
```

## Padrão de Implementação

### Schema de Validação
```typescript
export const [entity]Schema = z.object({
  body: z.object({
    // Campos obrigatórios
    fieldName: z.string().min(1, 'Mensagem de erro'),
    
    // Campos com validações específicas
    email: z.string().email('Email inválido'),
    
    // Campos com transformações
    date: z.string().transform((date) => new Date(date)),
    
    // Campos com validações customizadas
    password: z.string()
      .min(6, 'Mínimo 6 caracteres')
      .regex(/[A-Z]/, 'Deve conter maiúscula'),
  }).openapi({
    ref: '[Entity]Input',
    description: 'Descrição do schema',
  }),
});
```

### Schema de Resposta
```typescript
export const [entity]ResponseSchema = z
  .object({
    id: z.number().openapi({
      description: 'ID único',
      example: 1,
    }),
    name: z.string().openapi({
      description: 'Nome',
      example: 'Exemplo',
    }),
  })
  .openapi({
    ref: '[Entity]',
    description: 'Informações da entidade',
  });
```

### Tipos TypeScript
```typescript
// Tipos de entrada
export type Create[Entity]Input = z.infer<typeof create[Entity]Schema>['body'];
export type Update[Entity]Input = z.infer<typeof update[Entity]Schema>['body'];

// Tipos de resposta
export type [Entity]Response = z.infer<typeof [entity]ResponseSchema>;
```

## Uso e Importação

### Importação de Schemas
```typescript
import { 
  loginSchema, 
  registerSchema,
  userResponseSchema 
} from '@/validations/v1/modules/auth.validations';

import { 
  createRoleSchema, 
  updateRoleSchema 
} from '@/validations/v1/modules/role.validations';

import { 
  createPermissionSchema, 
  updatePermissionSchema 
} from '@/validations/v1/modules/permission.validations';
```

### Importação de Tipos
```typescript
import { 
  LoginInput, 
  RegisterInput,
  UserResponse 
} from '@/validations/v1/modules/auth.validations';

import { 
  CreateRoleInput, 
  UpdateRoleInput 
} from '@/validations/v1/modules/role.validations';

import { 
  CreatePermissionInput, 
  UpdatePermissionInput 
} from '@/validations/v1/modules/permission.validations';
```

### Uso em Controllers
```typescript
import { LoginInput } from '@/validations/v1/modules/auth.validations';

export class AuthController {
  async login(req: Request<{}, {}, LoginInput>, res: Response) {
    const { email, password } = req.body;
    
    // Os dados já foram validados pelo middleware
    const result = await AuthService.login({ email, password });
    
    res.json(result);
  }
}
```

### Uso em Services
```typescript
import { CreateRoleInput } from '@/validations/v1/modules/role.validations';

export class RoleService {
  async create(roleData: CreateRoleInput) {
    // Os dados já foram validados
    const role = await RoleRepository.create(roleData);
    return role;
  }
}
```

## Características Técnicas

### Validação com Zod
- **Type Safety**: Validação em tempo de execução com tipos TypeScript
- **Schema Composition**: Combinação e reutilização de schemas
- **Custom Validation**: Validações customizadas com `.refine()`
- **Data Transformation**: Transformação automática de dados
- **Error Messages**: Mensagens de erro personalizadas e localizadas

### Integração OpenAPI
- **Auto-documentation**: Documentação automática da API
- **Schema References**: Referências reutilizáveis de schemas
- **Examples**: Exemplos de dados para cada campo
- **Descriptions**: Descrições detalhadas para documentação
- **Security**: Documentação de esquemas de segurança

### Estrutura Modular
- **Domain Separation**: Separação por domínio de negócio
- **Versioning**: Versionamento da API (v1)
- **Reusability**: Schemas reutilizáveis entre módulos
- **Maintainability**: Fácil manutenção e extensão

## Boas Práticas Implementadas

- ✅ **Organização Clara**: Separação por módulos e domínios
- ✅ **Versionamento**: Estrutura v1 para controle de versão
- ✅ **Type Safety**: Geração automática de tipos TypeScript
- ✅ **OpenAPI Integration**: Documentação automática da API
- ✅ **Error Messages**: Mensagens de erro claras e específicas
- ✅ **Schema Reuse**: Reutilização de schemas comuns
- ✅ **Validation Rules**: Regras de validação consistentes
- ✅ **Data Transformation**: Transformação automática quando apropriado
- ✅ **Constants Usage**: Uso de enums para valores fixos
- ✅ **Modular Structure**: Estrutura modular e extensível

## Convenções de Nomenclatura

- **Arquivos**: `[entity].validations.ts` (ex: `auth.validations.ts`)
- **Schemas**: `[action][Entity]Schema` (ex: `createUserSchema`, `updateRoleSchema`)
- **Response Schemas**: `[entity]ResponseSchema` (ex: `userResponseSchema`)
- **Types**: `[Action][Entity]Input` (ex: `CreateRoleInput`, `UpdatePermissionInput`)
- **Response Types**: `[Entity]Response` (ex: `UserResponse`)
- **Pastas**: Nome descritivo do domínio (ex: `auth`, `role`, `permission`)

## Dependências

- **Zod**: Biblioteca principal para validação de schemas
- **Zod OpenAPI**: Extensão para integração com OpenAPI
- **TypeScript**: Para tipagem estática e inferência de tipos

## Fluxo de Validação

### Validação de Requisição
```
Request → Middleware de Validação → Schema Zod → Controller → Service
```

### Geração de Tipos
```
Schema Zod → TypeScript Inference → Tipos Automáticos → IntelliSense
```

### Documentação OpenAPI
```
Schema Zod → OpenAPI Metadata → Documentação Automática → Swagger UI
```

## Extensibilidade

### Adicionando Novos Schemas
```typescript
// v1/modules/new-entity.validations.ts
export const createNewEntitySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    description: z.string().optional(),
  }).openapi({
    ref: 'CreateNewEntityInput',
    description: 'Dados para criação de nova entidade',
  }),
});

export type CreateNewEntityInput = z.infer<typeof createNewEntitySchema>['body'];
```

### Adicionando Novas Validações
```typescript
// Validação customizada
export const customValidationSchema = z.object({
  body: z.object({
    field: z.string()
      .min(1, 'Campo obrigatório')
      .refine((value) => customValidation(value), {
        message: 'Validação customizada falhou',
      }),
  }),
});
```

### Adicionando Novos Módulos
```typescript
// v1/modules/new-module/
├── new-module.validations.ts
└── index.ts

// Exportação no index.ts do módulo
export * from './new-module.validations';
```

## Integração com Outros Módulos

### Controllers
```typescript
import { validateRequest } from '@/middlewares/validate-request.middlewares';
import { createUserSchema } from '@/validations/v1/modules/auth.validations';

router.post('/users', validateRequest(createUserSchema), UserController.create);
```

### Services
```typescript
import { CreateUserInput } from '@/validations/v1/modules/auth.validations';

export class UserService {
  async create(userData: CreateUserInput) {
    // Dados já validados
    const user = await UserRepository.create(userData);
    return user;
  }
}
```

### Middlewares
```typescript
import { validateRequest } from '@/middlewares/validate-request.middlewares';

// Middleware de validação genérico
export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Dados inválidos',
          errors: error.errors,
        });
      }
      next(error);
    }
  };
};
```

## Configuração e Ambiente

### Desenvolvimento
- **TypeScript**: Tipagem estática e IntelliSense
- **Zod Dev**: Validação em tempo de desenvolvimento
- **OpenAPI**: Documentação automática atualizada

### Produção
- **Runtime Validation**: Validação em tempo de execução
- **Error Handling**: Tratamento robusto de erros de validação
- **Performance**: Validação otimizada para produção

### Testes
- **Schema Testing**: Testes unitários para schemas
- **Validation Testing**: Testes de validação de dados
- **Type Testing**: Testes de tipos TypeScript

## Monitoramento e Debugging

### Logs de Validação
```typescript
// Log de erros de validação
if (error instanceof z.ZodError) {
  logger.error('Erro de validação:', {
    errors: error.errors,
    path: req.path,
    method: req.method,
  });
}
```

### Métricas de Validação
```typescript
// Contador de erros de validação
validationErrorCounter.inc({
  endpoint: req.path,
  method: req.method,
});
```

## Segurança

### Sanitização de Dados
```typescript
// Sanitização automática
email: z.string()
  .email('Email inválido')
  .toLowerCase(), // Normaliza email

password: z.string()
  .min(6, 'Mínimo 6 caracteres')
  .regex(/[A-Z]/, 'Deve conter maiúscula')
  .regex(/[0-9]/, 'Deve conter número'),
```

### Validação de Entrada
```typescript
// Prevenção de injeção
name: z.string()
  .min(1, 'Nome obrigatório')
  .max(100, 'Nome muito longo')
  .regex(/^[a-zA-Z\s]+$/, 'Apenas letras e espaços'),
```

## Performance

### Validação Lazy
```typescript
// Validação apenas quando necessário
export const conditionalSchema = z.object({
  field: z.string().optional(),
}).refine((data) => {
  // Validação customizada apenas quando field existe
  if (data.field) {
    return customValidation(data.field);
  }
  return true;
});
```

### Cache de Schemas
```typescript
// Cache de schemas compilados
const compiledSchemas = new Map();

export const getCompiledSchema = (schema: z.ZodSchema) => {
  if (!compiledSchemas.has(schema)) {
    compiledSchemas.set(schema, schema.parse);
  }
  return compiledSchemas.get(schema);
};
``` 