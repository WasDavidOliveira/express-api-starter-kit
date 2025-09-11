# Repositories da API

Esta pasta contém os repositórios da aplicação, que são responsáveis pela interação direta com o banco de dados. Os repositórios implementam o padrão Repository, que encapsula a lógica de acesso a dados e fornece uma interface de alto nível para os serviços.

## Conceito

O padrão Repository cria uma abstração entre a camada de acesso a dados e a lógica de negócios da aplicação, permitindo:

- Isolamento da lógica de persistência
- Código mais testável através de mocks
- Centralização das queries e operações de banco de dados
- Desacoplamento da lógica de negócio da infraestrutura de dados

## Estrutura da Pasta

```
repositories/
├── README.md                    # Esta documentação
└── v1/                         # Versão 1 da API
    └── modules/                # Módulos organizados por domínio
        ├── auth/               # Módulo de autenticação
        │   ├── user.repository.ts
        │   └── index.ts
        ├── role/               # Módulo de roles
        │   ├── role.repository.ts
        │   └── index.ts
        ├── permission/         # Módulo de permissões
        │   ├── permission.repository.ts
        │   └── index.ts
        ├── role-permission/    # Módulo de relacionamento role-permissão
        │   ├── role-permission.repository.ts
        │   └── index.ts
        └── index.ts            # Exportação centralizada dos módulos
```

## Módulos Disponíveis

### 🔐 **Auth Module** (`auth/`)

Repositório para gerenciamento de usuários:

- **`user.repository.ts`**: Operações CRUD para usuários
  - `findById(id)`: Buscar usuário por ID
  - `findByEmail(email)`: Buscar usuário por email
  - `create(userData)`: Criar novo usuário
  - Tratamento de erros de conflito (email duplicado)

### 🛡️ **Role Module** (`role/`)

Repositório para gerenciamento de roles:

- **`role.repository.ts`**: Operações CRUD para roles
  - `create(roleData)`: Criar nova role
  - `update(id, roleData)`: Atualizar role existente
  - `findById(id)`: Buscar role por ID
  - `findAll()`: Listar todas as roles
  - `delete(id)`: Remover role (com limpeza de relacionamentos)

### 🔑 **Permission Module** (`permission/`)

Repositório para gerenciamento de permissões:

- **`permission.repository.ts`**: Operações CRUD para permissões
  - `create(permissionData)`: Criar nova permissão
  - `update(id, permissionData)`: Atualizar permissão existente
  - `findById(id)`: Buscar permissão por ID
  - `findAll()`: Listar todas as permissões
  - `delete(id)`: Remover permissão

### 🔗 **Role-Permission Module** (`role-permission/`)

Repositório para gerenciamento de relacionamentos entre roles e permissões:

- **`role-permission.repository.ts`**: Operações de relacionamento
  - `attach(roleId, permissionId)`: Associar permissão a uma role
  - `detach(roleId, permissionId)`: Remover permissão de uma role
  - `findByRolePermissionByRoleId(roleId)`: Buscar permissões de uma role
  - `findByRolePermissionByPermissionId(permissionId)`: Buscar roles de uma permissão
  - `findAllByRoleId(roleId)`: Listar permissões de uma role com JOIN

## Responsabilidades

Os repositórios são responsáveis por:

- Executar operações CRUD (Create, Read, Update, Delete)
- Implementar queries complexas e específicas usando Drizzle ORM
- Traduzir dados entre o formato do banco de dados e objetos de domínio
- Gerenciar transações quando necessário
- Tratar erros específicos de banco de dados
- Implementar relacionamentos entre entidades

## Padrão de Implementação

### Estrutura Base dos Repositories

```typescript
import { [entity] } from '@/db/schema/v1/[entity].schema';
import { db } from '@/db/db.connection';
import { eq } from 'drizzle-orm';
import { Create[Entity]Model, [Entity]Model } from '@/types/models/v1/[entity].types';

class [Entity]Repository {
  async create(data: Create[Entity]Model): Promise<[Entity]Model> {
    const [new[Entity]] = await db.insert([entity]).values(data).returning();
    return new[Entity];
  }

  async findById(id: number): Promise<[Entity]Model | null> {
    const results = await db
      .select()
      .from([entity])
      .where(eq([entity].id, id))
      .limit(1);

    return results[0] || null;
  }

  // ... outros métodos
}

export default new [Entity]Repository();
```

### Tratamento de Erros

```typescript
async create(userData: CreateUserModel): Promise<UserModel> {
  try {
    const [newUser] = await db.insert(user).values(userData).returning();
    return newUser;
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'detail' in error
    ) {
      const dbError = error as { code: string; detail: string };

      if (dbError.code === '23505') {
        if (dbError.detail.includes('email')) {
          throw new ConflictError('Email já está em uso');
        }
        throw new ConflictError('Recurso já existe');
      }
    }
    throw error;
  }
}
```

### Queries com JOIN

```typescript
async findAllByRoleId(roleId: number) {
  const rolePermissionsList = await db
    .select({
      id: permissions.id,
      name: permissions.name,
      description: permissions.description,
      action: permissions.action,
      createdAt: permissions.createdAt,
      updatedAt: permissions.updatedAt,
    })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, roleId));

  return rolePermissionsList;
}
```

## Exemplo de Implementação

### User Repository

```typescript
// user.repository.ts
import { user } from '@/db/schema/v1/user.schema';
import { CreateUserModel, UserModel } from '@/types/models/v1/auth.types';
import { db } from '@/db/db.connection';
import { eq } from 'drizzle-orm';
import { ConflictError } from '@/utils/core/app-error.utils';

class UserRepository {
  async findById(id: number): Promise<UserModel | null> {
    const users = await db.select().from(user).where(eq(user.id, id)).limit(1);
    return users[0] || null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const users = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);
    return users[0] || null;
  }

  async create(userData: CreateUserModel): Promise<UserModel> {
    try {
      const [newUser] = await db.insert(user).values(userData).returning();
      return newUser;
    } catch (error: unknown) {
      // Tratamento de erros de conflito
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        'detail' in error
      ) {
        const dbError = error as { code: string; detail: string };
        if (dbError.code === '23505') {
          if (dbError.detail.includes('email')) {
            throw new ConflictError('Email já está em uso');
          }
          throw new ConflictError('Recurso já existe');
        }
      }
      throw error;
    }
  }
}

export default new UserRepository();
```

## Integração com Serviços

Os repositórios são consumidos pelos serviços, que implementam a lógica de negócios:

```typescript
// Em um service
import UserRepository from '@/repositories/v1/modules/auth/user.repository';
import RoleRepository from '@/repositories/v1/modules/role/role.repository';

export class AuthService {
  async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    // Lógica de autenticação...
    return user;
  }

  async createUserWithRole(userData: CreateUserInput, roleId: number) {
    const user = await UserRepository.create(userData);
    // Lógica adicional...
    return user;
  }
}
```

## Características Técnicas

### ORM e Queries

- **Drizzle ORM**: ORM moderno e type-safe para TypeScript
- **Queries tipadas**: Uso de schemas para garantir tipagem
- **Operações CRUD**: Métodos padrão para todas as entidades
- **JOINs otimizados**: Queries eficientes para relacionamentos

### Tratamento de Erros

- **Erros específicos**: Tratamento de códigos de erro do banco
- **Classes de erro**: Uso de `ConflictError` e outras classes personalizadas
- **Fallback seguro**: Re-throw de erros não tratados

### Performance

- **Limite de resultados**: Uso de `.limit(1)` para queries únicas
- **Queries otimizadas**: Seleção específica de campos quando necessário
- **Transações**: Gerenciamento de operações relacionadas

## Boas Práticas Implementadas

- ✅ Repositórios focados em uma única entidade
- ✅ Métodos específicos para consultas complexas
- ✅ Sem lógica de negócios nos repositórios
- ✅ Tratamento robusto de erros de banco de dados
- ✅ Uso de Drizzle ORM para queries type-safe
- ✅ Organização modular por domínio
- ✅ Padrão de exportação consistente
- ✅ Tratamento de relacionamentos entre entidades

## Convenções de Nomenclatura

- **Repositories**: `[Entity]Repository` (ex: `UserRepository`)
- **Métodos**: Verbos descritivos (ex: `findById`, `create`, `update`)
- **Arquivos**: `[entity].repository.ts` (ex: `user.repository.ts`)
- **Pastas**: Nome do domínio em minúsculo (ex: `auth`, `role`)

## Dependências

- **Drizzle ORM**: Para operações de banco de dados
- **Schemas**: Para definição de estrutura das tabelas
- **Types**: Para tipagem dos modelos de dados
- **Utils**: Para classes de erro personalizadas
- **DB Connection**: Para conexão com o banco de dados
