# Types

Este diretório contém definições de tipos TypeScript utilizados em toda a aplicação, organizados por funcionalidade e domínio para facilitar a manutenção e reutilização.

## Conceito

Os types definem a estrutura de dados e interfaces utilizadas em toda a aplicação, garantindo type safety e consistência. Eles são organizados por:

- **Core**: Tipos fundamentais da aplicação (erros, JWT, OpenAPI)
- **Infrastructure**: Tipos relacionados à infraestrutura (middlewares, banco de dados)
- **Models**: Tipos específicos dos modelos de dados organizados por versão da API
- **Express**: Extensões das interfaces nativas do Express

## Estrutura da Pasta

```
types/
├── README.md                    # Esta documentação
├── core/                        # Tipos fundamentais da aplicação
│   ├── errors.types.ts         # Tipos para tratamento de erros
│   ├── jwt.types.ts            # Tipos para tokens JWT
│   ├── openapi.types.ts        # Tipos para documentação OpenAPI
│   └── index.ts                # Exportação centralizada dos tipos core
├── infrastructure/              # Tipos relacionados à infraestrutura
│   ├── middlewares.types.ts    # Tipos para middlewares
│   └── index.ts                # Exportação centralizada dos tipos de infraestrutura
├── models/                      # Tipos dos modelos de dados
│   └── v1/                     # Tipos para modelos da API v1
│       ├── auth.types.ts       # Tipos para autenticação e usuários
│       ├── role.types.ts       # Tipos para roles
│       ├── permission.types.ts # Tipos para permissões
│       └── index.ts            # Exportação centralizada dos tipos de modelos
└── express/                     # Extensões das interfaces do Express
    ├── index.d.ts              # Extensão da interface Request do Express
    └── index.ts                # Exportação centralizada dos tipos do Express
```

## Módulos Disponíveis

### 🔧 **Core Module** (`core/`)
Tipos fundamentais da aplicação:

- **`errors.types.ts`**: Tipos para tratamento de erros
  - `PostgresError`: Erros específicos do PostgreSQL
  - `ValidationErrorItem`: Campos com erro de validação

- **`jwt.types.ts`**: Tipos para tokens JWT
  - `JwtPayload`: Estrutura do payload JWT

- **`openapi.types.ts`**: Tipos para documentação OpenAPI
  - `HttpMethod`: Métodos HTTP suportados
  - `PathItem`: Estrutura de um endpoint
  - `OpenAPISpec`: Especificação completa da API

### 🏗️ **Infrastructure Module** (`infrastructure/`)
Tipos relacionados à infraestrutura:

- **`middlewares.types.ts`**: Tipos para middlewares
  - `UserWithRoles`: Usuário com suas roles
  - `UserRole`: Relacionamento usuário-role
  - `UserWithRole`: Alias para UserWithRoles

### 📊 **Models Module** (`models/v1/`)
Tipos dos modelos de dados da API v1:

- **`auth.types.ts`**: Tipos de autenticação
  - `UserModel`: Modelo completo do usuário
  - `CreateUserModel`: Dados para criação de usuário

- **`role.types.ts`**: Tipos de roles
  - `RoleModel`: Modelo completo da role
  - `CreateRoleModel`: Dados para criação de role

- **`permission.types.ts`**: Tipos de permissões
  - `PermissionModel`: Modelo completo da permissão
  - `CreatePermissionModel`: Dados para criação de permissão
  - `PermissionCheck`: Verificação de permissão

### 🌐 **Express Module** (`express/`)
Extensões das interfaces nativas do Express:

- **`index.d.ts`**: Extensão da interface Request
  - `userId`: ID do usuário autenticado

## Descrição Detalhada

### Core Types

#### **Errors Types** (`core/errors.types.ts`)
```typescript
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
```

#### **JWT Types** (`core/jwt.types.ts`)
```typescript
export type JwtPayload = {
  id: number;
};
```

#### **OpenAPI Types** (`core/openapi.types.ts`)
```typescript
export type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head';

export type PathItem = {
  summary?: string;
  description?: string;
  parameters?: PathParameter[];
  responses?: Record<string, PathResponse>;
  requestBody?: RequestBody;
  [key: string]: unknown;
};

export type OpenAPISpec = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: Record<string, Record<HttpMethod, PathItem>>;
  components?: {
    schemas?: Record<string, SchemaObject>;
    securitySchemes?: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};
```

### Infrastructure Types

#### **Middlewares Types** (`infrastructure/middlewares.types.ts`)
```typescript
export type UserWithRoles = {
  id: number;
  name: string;
  email: string;
  userRoles: Array<{
    userId: number;
    roleId: number;
    role: {
      id: number;
      name: string;
      description: string;
    };
  }>;
};

export type UserRole = {
  userId: number;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithRole = UserWithRoles;
```

### Model Types

#### **Auth Types** (`models/v1/auth.types.ts`)
```typescript
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { user } from '@/db/schema/v1/user.schema';

export type UserModel = InferSelectModel<typeof user>;
export type CreateUserModel = InferInsertModel<typeof user>;
```

#### **Role Types** (`models/v1/role.types.ts`)
```typescript
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { roles } from '@/db/schema/v1/role.schema';

export type RoleModel = InferSelectModel<typeof roles>;
export type CreateRoleModel = InferInsertModel<typeof roles>;
```

#### **Permission Types** (`models/v1/permission.types.ts`)
```typescript
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { permissions } from '@/db/schema/v1/permission.schema';
import { PermissionAction } from '@/constants/permission.constants';

export type PermissionModel = InferSelectModel<typeof permissions>;
export type CreatePermissionModel = InferInsertModel<typeof permissions>;

export type PermissionCheck = {
  name: string;
  action: PermissionAction;
};
```

### Express Types

#### **Express Extensions** (`express/index.d.ts`)
```typescript
declare namespace Express {
  export interface Request {
    userId: number;
  }
}
```

## Padrão de Implementação

### Tipos de Modelos com Drizzle ORM
```typescript
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { [entity] } from '@/db/schema/v1/[entity].schema';

// Tipo para leitura (SELECT)
export type [Entity]Model = InferSelectModel<typeof [entity]>;

// Tipo para inserção (INSERT)
export type Create[Entity]Model = InferInsertModel<typeof [entity]>;
```

### Tipos de Erro Personalizados
```typescript
export type [Entity]Error = Error & {
  code?: string;
  detail?: string;
  field?: string;
  value?: unknown;
};
```

### Tipos de Validação
```typescript
export type [Entity]Validation = {
  field: string;
  message: string;
  code?: string;
  value?: unknown;
};
```

## Uso e Importação

### Importação de Tipos Core
```typescript
import { PostgresError, ValidationErrorItem } from '@/types/core/errors.types';
import { JwtPayload } from '@/types/core/jwt.types';
import { OpenAPISpec, HttpMethod } from '@/types/core/openapi.types';
```

### Importação de Tipos de Infraestrutura
```typescript
import { UserWithRoles, UserRole } from '@/types/infrastructure/middlewares.types';
```

### Importação de Tipos de Modelos
```typescript
import { UserModel, CreateUserModel } from '@/types/models/v1/auth.types';
import { RoleModel, CreateRoleModel } from '@/types/models/v1/role.types';
import { PermissionModel, CreatePermissionModel } from '@/types/models/v1/permission.types';
```

### Importação de Tipos do Express
```typescript
// Os tipos do Express são automaticamente disponíveis
// após a declaração em index.d.ts
req.userId; // number
```

## Características Técnicas

### Type Safety
- **Inferência Automática**: Uso de `InferSelectModel` e `InferInsertModel` do Drizzle ORM
- **Validação em Tempo de Compilação**: Detecção de erros antes da execução
- **IntelliSense**: Autocompletar e verificação de tipos no editor

### Organização Modular
- **Separação por Funcionalidade**: Core, Infrastructure, Models
- **Versionamento**: Suporte para múltiplas versões da API
- **Reutilização**: Tipos compartilhados entre diferentes módulos

### Integração com Drizzle ORM
- **Schemas Automáticos**: Tipos derivados dos schemas do banco
- **Consistência**: Sincronização automática entre schema e tipos
- **Manutenibilidade**: Mudanças no schema refletem automaticamente nos tipos

## Boas Práticas Implementadas

- ✅ **Organização Clara**: Separação por funcionalidade e domínio
- ✅ **Type Safety**: Uso de tipos TypeScript rigorosos
- ✅ **Integração ORM**: Tipos derivados dos schemas do Drizzle
- ✅ **Reutilização**: Tipos compartilhados entre módulos
- ✅ **Versionamento**: Suporte para múltiplas versões da API
- ✅ **Extensibilidade**: Fácil adição de novos tipos
- ✅ **Documentação**: Comentários explicativos nos tipos complexos
- ✅ **Consistência**: Padrão uniforme de nomenclatura

## Convenções de Nomenclatura

- **Arquivos**: `[entity].types.ts` ou `[category].types.ts`
- **Tipos de Modelo**: `[Entity]Model` e `Create[Entity]Model`
- **Tipos de Erro**: `[Entity]Error`
- **Tipos de Validação**: `[Entity]Validation`
- **Pastas**: Nome descritivo da funcionalidade (ex: `core`, `infrastructure`)

## Dependências

- **Drizzle ORM**: Para inferência de tipos dos schemas
- **TypeScript**: Para definição e verificação de tipos
- **Express**: Para extensão das interfaces nativas
- **Constants**: Para tipos de permissões e outras constantes

## Fluxo de Tipos

### Criação de Tipos
```
Schema Drizzle → InferSelectModel → UserModel
Schema Drizzle → InferInsertModel → CreateUserModel
```

### Uso nos Services
```
Service → UserModel → Repository → Database
Service → CreateUserModel → Validation → Repository
```

### Uso nos Controllers
```
Controller → Request → Validation → Service
Controller → Response → UserModel → Resource
```

## Extensibilidade

### Adicionando Novos Tipos de Modelo
```typescript
// models/v1/new-entity.types.ts
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { newEntity } from '@/db/schema/v1/new-entity.schema';

export type NewEntityModel = InferSelectModel<typeof newEntity>;
export type CreateNewEntityModel = InferInsertModel<typeof newEntity>;
```

### Adicionando Novos Tipos Core
```typescript
// core/new-feature.types.ts
export type NewFeatureConfig = {
  enabled: boolean;
  options: string[];
  timeout: number;
};
```

### Adicionando Novos Tipos de Infraestrutura
```typescript
// infrastructure/database.types.ts
export type DatabaseConfig = {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
};
``` 