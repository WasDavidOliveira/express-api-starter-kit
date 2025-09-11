# Resources da API

Esta pasta contém os recursos da aplicação, que definem a estrutura e o comportamento dos diferentes recursos expostos pela API. Cada recurso representa uma entidade de negócio ou conceito que pode ser manipulado através dos endpoints da API.

## Conceito

Os recursos definem a camada de transformação e serialização de dados da aplicação, servindo como a representação canônica das entidades para consumo externo. Eles são responsáveis por:

- Definir a estrutura dos dados retornados pela API
- Prover métodos de transformação e serialização
- Encapsular a lógica de apresentação e formatação de dados
- Ocultar campos sensíveis ou internos
- Garantir consistência nas respostas da API

## Estrutura da Pasta

```
resources/
├── README.md                    # Esta documentação
└── v1/                         # Versão 1 da API
    └── modules/                # Módulos organizados por domínio
        ├── user/               # Módulo de usuários
        │   ├── user.resources.ts
        │   └── index.ts
        ├── role/               # Módulo de roles
        │   ├── role.resource.ts
        │   └── index.ts
        ├── permission/         # Módulo de permissões
        │   ├── permission.resource.ts
        │   └── index.ts
        └── index.ts            # Exportação centralizada dos módulos
```

## Módulos Disponíveis

### 👤 **User Module** (`user/`)

Resource para transformação de dados de usuários:

- **`user.resources.ts`**: Transformação de usuários
  - `toResponse(user)`: Transforma usuário completo (oculta senha)
  - `toResponseBasic(user)`: Transforma dados básicos do usuário
  - `collectionToResponse(users)`: Transforma coleção de usuários

### 🛡️ **Role Module** (`role/`)

Resource para transformação de dados de roles:

- **`role.resource.ts`**: Transformação de roles
  - `toResponse(role)`: Transforma role completa
  - `collectionToResponse(roles)`: Transforma coleção de roles

### 🔑 **Permission Module** (`permission/`)

Resource para transformação de dados de permissões:

- **`permission.resource.ts`**: Transformação de permissões
  - `toResponse(permission)`: Transforma permissão completa
  - `collectionToResponse(permissions)`: Transforma coleção de permissões

## Responsabilidades

Os recursos são responsáveis por:

- Definir a estrutura dos objetos retornados pela API
- Transformar objetos de domínio em representações para API
- Ocultar campos sensíveis ou internos (ex: senhas)
- Formatar datas, números e outros tipos de dados
- Garantir consistência nas respostas da API
- Prover métodos para transformação individual e em coleção

## Padrão de Implementação

### Estrutura Base dos Resources

```typescript
import { [Entity]Model } from '@/types/models/v1/[entity].types';

export class [Entity]Resource {
  static toResponse([entity]: [Entity]Model) {
    return {
      id: [entity].id,
      name: [entity].name,
      // ... outros campos seguros
      createdAt: [entity].createdAt,
      updatedAt: [entity].updatedAt,
    };
  }

  static collectionToResponse([entities]: [Entity]Model[]) {
    return [entities].map(([entity]) => this.toResponse([entity]));
  }
}
```

### Tratamento de Campos Sensíveis

```typescript
static toResponse(user: UserModel) {
  const { password: _password, ...userSafe } = user;
  return userSafe;
}
```

### Transformação de Coleções

```typescript
static collectionToResponse(users: UserModel[]) {
  return users.map((user) => this.toResponse(user));
}
```

## Exemplo de Implementação

### User Resource

```typescript
// user.resources.ts
import { UserModel } from '@/types/models/v1/auth.types';

export class UserResource {
  static toResponse(user: UserModel) {
    const { password: _password, ...userSafe } = user;
    return userSafe;
  }

  static toResponseBasic(user: UserModel) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static collectionToResponse(users: UserModel[]) {
    return users.map(user => this.toResponse(user));
  }
}
```

### Role Resource

```typescript
// role.resource.ts
import { RoleModel } from '@/types/models/v1/role.types';

export class RoleResource {
  static toResponse(role: RoleModel) {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  static collectionToResponse(roles: RoleModel[]) {
    return roles.map(role => this.toResponse(role));
  }
}
```

### Permission Resource

```typescript
// permission.resource.ts
import { PermissionModel } from '@/types/models/v1/permission.types';

export class PermissionResource {
  static toResponse(permission: PermissionModel) {
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      action: permission.action,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }

  static collectionToResponse(permissions: PermissionModel[]) {
    return permissions.map(permission => this.toResponse(permission));
  }
}
```

## Integração com Controllers

Os recursos são utilizados pelos controllers para formatar a resposta da API:

```typescript
// Em um controller
import { UserResource } from '@/resources/v1/modules/user/user.resources';
import { RoleResource } from '@/resources/v1/modules/role/role.resource';

export class AuthController {
  async register(req: Request, res: Response) {
    const user = await AuthService.register(req.body);

    res.status(StatusCode.OK).json({
      message: 'Usuário criado com sucesso.',
      user: UserResource.toResponse(user),
    });
  }
}

export class RoleController {
  async index(req: Request, res: Response) {
    const roles = await RoleService.findAll();

    res.status(StatusCode.OK).json({
      message: 'Roles listadas com sucesso.',
      data: RoleResource.collectionToResponse(roles),
    });
  }
}
```

## Características Técnicas

### Transformação de Dados

- **Métodos estáticos**: Uso de métodos estáticos para facilitar o acesso
- **Desestruturação segura**: Remoção de campos sensíveis com desestruturação
- **Mapeamento de coleções**: Transformação eficiente de arrays de entidades

### Segurança

- **Ocultação de senhas**: Remoção automática de campos sensíveis
- **Dados filtrados**: Exposição apenas de campos seguros para a API
- **Consistência**: Estrutura padronizada para todas as respostas

### Performance

- **Transformação sob demanda**: Sem cache desnecessário
- **Mapeamento eficiente**: Uso de `map` para coleções
- **Sem mutação**: Criação de novos objetos sem alterar os originais

## Boas Práticas Implementadas

- ✅ Resources focados em uma única entidade
- ✅ Ocultação automática de campos sensíveis
- ✅ Métodos estáticos para fácil acesso
- ✅ Transformação consistente de dados
- ✅ Suporte a transformação individual e em coleção
- ✅ Organização modular por domínio
- ✅ Padrão de exportação consistente
- ✅ Tipagem forte com TypeScript

## Convenções de Nomenclatura

- **Resources**: `[Entity]Resource` (ex: `UserResource`)
- **Métodos**: `toResponse`, `collectionToResponse`
- **Arquivos**: `[entity].resource.ts` ou `[entity].resources.ts`
- **Pastas**: Nome do domínio em minúsculo (ex: `user`, `role`)

## Dependências

- **Types**: Para tipagem dos modelos de dados
- **Models**: Para acesso aos tipos de entidades
- **Controllers**: Para uso na formatação de respostas
- **Services**: Para acesso aos dados transformados

## Padrão de Resposta da API

### Resposta Individual

```typescript
{
  "message": "Operação realizada com sucesso.",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Resposta de Coleção

```typescript
{
  "message": "Dados listados com sucesso.",
  "data": [
    {
      "id": 1,
      "name": "Admin",
      "description": "Administrador do sistema",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```
