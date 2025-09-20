# Utils

Este diretório contém utilitários essenciais utilizados em toda a aplicação para fornecer funcionalidades comuns e reutilizáveis, organizados por funcionalidade para facilitar a manutenção e reutilização.

## Conceito

Os utils fornecem funcionalidades transversais e reutilizáveis em toda a aplicação, organizados por:

- **Core**: Utilitários fundamentais da aplicação (tratamento de erros, logs)
- **Infrastructure**: Utilitários relacionados à infraestrutura (tratamento assíncrono)
- **Documentation**: Utilitários para geração de documentação (OpenAPI)

## Estrutura da Pasta

```
utils/
├── README.md                    # Esta documentação
├── core/                        # Utilitários fundamentais da aplicação
│   ├── logger.utils.ts         # Sistema de logs da aplicação
│   └── index.ts                # Exportação centralizada dos utils core
├── infrastructure/              # Utilitários relacionados à infraestrutura
│   ├── catch-async.utils.ts    # Funções para tratamento assíncrono
│   └── index.ts                # Exportação centralizada dos utils de infraestrutura
└── documentation/               # Utilitários para documentação
    ├── openapi.utils.ts        # Geração de documentação OpenAPI
    └── index.ts                # Exportação centralizada dos utils de documentação
```

## Módulos Disponíveis

### 🔧 **Core Module** (`core/`)

Utilitários fundamentais da aplicação:

- **`logger.utils.ts`**: Sistema completo de logs com Winston
  - Registro em arquivos e console
  - Organização de logs por data
  - Logs separados para erros e informações gerais
  - Métodos para diferentes níveis: info, error, warn, debug
  - Funções específicas para inicialização do servidor

### 🏗️ **Infrastructure Module** (`infrastructure/`)

Utilitários relacionados à infraestrutura:

- **`catch-async.utils.ts`**: Tratamento de erros assíncronos
  - `catchAsync`: Wrapper para funções assíncronas do Express
  - Elimina a necessidade de blocos try/catch
  - Captura automática de erros e repassa para o middleware de erro

### 📚 **Documentation Module** (`documentation/`)

Utilitários para geração de documentação:

- **`openapi.utils.ts`**: Geração de documentação OpenAPI (Swagger)
  - Define esquemas para endpoints da API
  - Gera documentação completa em formato JSON
  - Mapeia rotas, parâmetros e respostas
  - Implementa documentação de segurança com JWT
  - Gera arquivo `openapi.json` automaticamente

## Descrição Detalhada

### Core Utils

#### **Logger Utils** (`core/logger.utils.ts`)

```typescript
import winston from 'winston';
import path from 'path';
import fs from 'fs';

class Logger {
  private logger: winston.Logger;
  private logsDir: string;

  constructor() {
    const logFormat = printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    });

    this.logsDir = path.join(process.cwd(), 'logs');
    const currentDate = this.getCurrentDate();

    this.logger = winston.createLogger({
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize(),
        logFormat,
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: `${this.logsDir}/${currentDate}/error.log`,
          level: 'error',
        }),
        new winston.transports.File({
          filename: `${this.logsDir}/${currentDate}/combined.log`,
        }),
      ],
    });
  }

  serverStartup(env: string, port: number): void {
    this.logger.info(this.formatServerBanner());
    this.logger.info(this.formatServerInfo(env, port));
  }

  error(message: string, error?: unknown): void {
    this.logger.error(`❌ ${message}`, error);
  }

  info(message: string): void {
    this.logger.info(`ℹ️ ${message}`);
  }

  warn(message: string): void {
    this.logger.warn(`⚠️ ${message}`);
  }

  debug(message: string): void {
    this.logger.debug(`🔍 ${message}`);
  }
}

export const logger = new Logger();
```

### Infrastructure Utils

#### **Catch Async Utils** (`infrastructure/catch-async.utils.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

### Documentation Utils

#### **OpenAPI Utils** (`documentation/openapi.utils.ts`)

```typescript
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

  const openapiPath = path.resolve(process.cwd(), 'src/docs/openapi.json');
  fs.writeFileSync(openapiPath, JSON.stringify(document, null, 2));

  return document;
};
```

## Padrão de Implementação

### Funções Utilitárias

```typescript
export const [functionName] = (param: ParamType): ReturnType => {
  // Implementação da função
  return result;
};
```

### Classes Utilitárias

```typescript
export class [ClassName] {
  private [property]: [Type];

  constructor() {
    // Inicialização
  }

  public [methodName](): [ReturnType] {
    // Implementação do método
    return result;
  }
}
```

## Uso e Importação

### Tratamento Assíncrono

```typescript
import { catchAsync } from '@/utils/infrastructure/catch-async.utils';

// Em um controller
router.get(
  '/users',
  catchAsync(async (req, res) => {
    const users = await UserService.findAll();
    res.json(users);
  }),
);

// Elimina a necessidade de try/catch
router.post(
  '/users',
  catchAsync(async (req, res) => {
    const user = await UserService.create(req.body);
    res.status(201).json(user);
  }),
);
```

### Sistema de Logs

```typescript
import { logger } from '@/utils/core/logger.utils';

// Logs de diferentes níveis
logger.info('Operação realizada com sucesso');
logger.error('Erro ao processar requisição', error);
logger.warn('Aviso sobre operação');
logger.debug('Informação de debug');

// Log de inicialização do servidor
logger.serverStartup(process.env.NODE_ENV, 3000);
```

### Geração de Documentação OpenAPI

```typescript
import { generateOpenAPIDocument } from '@/utils/documentation/openapi.utils';

// Gera documentação automaticamente
const openAPIDoc = generateOpenAPIDocument();

// Salva em src/docs/openapi.json
// Pode ser usado para Swagger UI
```

## Características Técnicas

### Sistema de Logs

- **Winston**: Framework robusto para logging
- **Múltiplos Transportes**: Console e arquivos simultaneamente
- **Organização por Data**: Logs separados por dia
- **Níveis de Log**: info, error, warn, debug
- **Formatação Personalizada**: Timestamps e emojis para melhor legibilidade

### Tratamento Assíncrono

- **Wrapper Function**: Encapsula funções assíncronas
- **Error Propagation**: Repassa erros para middleware de erro
- **Express Integration**: Integração nativa com Express.js
- **Clean Code**: Elimina necessidade de try/catch

### Documentação OpenAPI

- **Zod Integration**: Validação de schemas com Zod
- **Auto-generation**: Geração automática de documentação
- **JWT Security**: Documentação de autenticação
- **File Output**: Gera arquivo JSON para Swagger UI

## Boas Práticas Implementadas

- ✅ **Organização Clara**: Separação por funcionalidade e propósito
- ✅ **Reutilização**: Utilitários compartilhados entre módulos
- ✅ **Type Safety**: Uso de TypeScript para todos os utilitários
- ✅ **Error Handling**: Sistema robusto de tratamento de erros
- ✅ **Logging**: Sistema completo de logs com Winston
- ✅ **Async Handling**: Tratamento limpo de operações assíncronas
- ✅ **Documentation**: Geração automática de documentação OpenAPI
- ✅ **Extensibilidade**: Fácil adição de novos utilitários

## Convenções de Nomenclatura

- **Arquivos**: `[category].utils.ts` ou `[entity].utils.ts`
- **Classes de Erro**: `[Entity]Error` (ex: `NotFoundError`, `ValidationError`)
- **Funções Utilitárias**: `[functionName]` (ex: `catchAsync`, `generateOpenAPIDocument`)
- **Classes Utilitárias**: `[ClassName]` (ex: `Logger`)
- **Pastas**: Nome descritivo da funcionalidade (ex: `core`, `infrastructure`, `documentation`)

## Dependências

- **Winston**: Para sistema de logs
- **Zod OpenAPI**: Para geração de documentação OpenAPI
- **Express**: Para tipos de Request, Response, NextFunction
- **Node.js**: Para operações de arquivo e path

## Fluxo de Utilização

### Tratamento Assíncrono

```
Controller → catchAsync → Service → Error → Middleware de Erro
```

### Sistema de Logs

```
Application → Logger → Console + Arquivos → Logs Organizados
```

### Documentação OpenAPI

```
Validations → OpenAPI Utils → JSON Schema → Swagger UI
```

## Extensibilidade

### Adicionando Novos Utilitários

```typescript
// infrastructure/new-utility.utils.ts
export const newUtility = (param: ParamType): ReturnType => {
  // Implementação
  return result;
};
```

### Adicionando Novos Utilitários de Documentação

```typescript
// documentation/new-doc.utils.ts
export const generateNewDocumentation = () => {
  // Geração de documentação
  return document;
};
```

## Integração com Outros Módulos

### Controllers

```typescript
import { catchAsync } from '@/utils/infrastructure/catch-async.utils';

export class UserController {
  async index(req: Request, res: Response) {
    const users = await UserService.findAll();
    res.json(users);
  }
}

// Uso com catchAsync
router.get('/users', catchAsync(UserController.index));
```

### Middlewares

```typescript
import { logger } from '@/utils/core/logger.utils';

export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info(`${req.method} ${req.path}`);
  next();
};
```

## Configuração e Ambiente

### Logs

- **Desenvolvimento**: Console colorido + arquivos
- **Produção**: Apenas arquivos (sem stack trace)
- **Organização**: Logs separados por data e tipo

### Documentação

- **Auto-generation**: Geração automática na inicialização
- **Output**: Arquivo JSON em `src/docs/openapi.json`
- **Schemas**: Baseados nas validações Zod existentes
