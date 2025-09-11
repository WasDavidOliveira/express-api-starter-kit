# Services da API

Esta pasta contém os serviços da aplicação, que implementam a lógica de negócios principal. Os serviços atuam como a camada intermediária entre os controllers e os repositórios, orquestrando operações complexas e encapsulando regras de negócio.

## Conceito

Os serviços são responsáveis pela execução da lógica de negócios da aplicação, atuando como mediadores entre a camada de controller (requisição/resposta) e a camada de persistência (repositórios). Eles:

- Centralizam a lógica de negócios
- Orquestram operações entre múltiplos repositórios
- Aplicam validações e regras específicas do domínio
- Abstraem a complexidade do domínio dos controllers
- Gerenciam autenticação e autorização
- Implementam operações CRUD com validações de negócio

## Estrutura da Pasta

```
services/
├── README.md                    # Esta documentação
└── v1/                         # Versão 1 da API
    └── modules/                # Módulos organizados por domínio
        ├── auth/               # Módulo de autenticação
        │   ├── auth.service.ts
        │   └── index.ts
        ├── role/               # Módulo de roles
        │   ├── role.service.ts
        │   └── index.ts
        ├── permission/         # Módulo de permissões
        │   ├── permission.service.ts
        │   └── index.ts
        ├── role-permission/    # Módulo de relacionamento role-permissão
        │   ├── role-permission.service.ts
        │   └── index.ts
        └── index.ts            # Exportação centralizada dos módulos
```

## Módulos Disponíveis

### 🔐 **Auth Module** (`auth/`)

Service para autenticação e gerenciamento de usuários:

- **`auth.service.ts`**: Lógica de autenticação
  - `login(data)`: Autenticação de usuário com JWT
  - `register(data)`: Registro de novo usuário
  - `me(userId)`: Obter dados do usuário autenticado

### 🛡️ **Role Module** (`role/`)

Service para gerenciamento de roles:

- **`role.service.ts`**: Lógica de roles
  - `create(roleData)`: Criar nova role
  - `show(id)`: Obter role específica
  - `update(id, roleData)`: Atualizar role
  - `delete(id)`: Deletar role
  - `findAll()`: Listar todas as roles

### 🔑 **Permission Module** (`permission/`)

Service para gerenciamento de permissões:

- **`permission.service.ts`**: Lógica de permissões
  - `create(permissionData)`: Criar nova permissão
  - `show(id)`: Obter permissão específica
  - `update(id, permissionData)`: Atualizar permissão
  - `delete(id)`: Deletar permissão
  - `findAll()`: Listar todas as permissões

### 🔗 **Role-Permission Module** (`role-permission/`)

Service para gerenciar relacionamentos entre roles e permissões:

- **`role-permission.service.ts`**: Lógica de relacionamentos
  - `attach(roleId, permissionId)`: Vincular permissão a uma role
  - `detach(roleId, permissionId)`: Desvincular permissão de uma role
  - `all(roleId)`: Listar permissões de uma role

## Responsabilidades

Os serviços são responsáveis por:

- Implementar a lógica de negócios central da aplicação
- Coordenar operações entre múltiplos repositórios
- Validar regras de negócio complexas
- Processar dados antes de persistir ou após recuperar do banco
- Lançar erros de domínio específicos
- Executar operações de domínio transacionais
- Gerenciar autenticação e autorização
- Implementar operações CRUD com validações de negócio
- Integrar com serviços externos quando necessário

## Padrão de Implementação

### Estrutura Base dos Services

```typescript
import [Entity]Repository from '@/repositories/v1/modules/[entity]/[entity].repository';
import { NotFoundError } from '@/utils/core/app-error.utils';
import { Create[Entity]Input } from '@/validations/v1/modules/[entity].validations';

export class [Entity]Service {
  async create([entity]Data: Create[Entity]Input) {
    const [entity] = await [Entity]Repository.create([entity]Data);
    return [entity];
  }

  async show(id: number) {
    const [entity] = await [Entity]Repository.findById(id);

    if (![entity]) {
      throw new NotFoundError('[Entity] não encontrada');
    }

    return [entity];
  }

  async update(id: number, [entity]Data: Create[Entity]Input) {
    const [entity] = await [Entity]Repository.findById(id);

    if (![entity]) {
      throw new NotFoundError('[Entity] não encontrada');
    }

    const updated[Entity] = await [Entity]Repository.update(id, [entity]Data);
    return updated[Entity];
  }

  async delete(id: number) {
    const [entity] = await [Entity]Repository.findById(id);

    if (![entity]) {
      throw new NotFoundError('[Entity] não encontrada');
    }

    await [Entity]Repository.delete(id);
    return true;
  }

  async findAll() {
    const [entities] = await [Entity]Repository.findAll();
    return [entities];
  }
}

export default new [Entity]Service();
```

### Tratamento de Erros

```typescript
import { NotFoundError, UnauthorizedError } from '@/utils/core/app-error.utils';

// Verificação de existência
if (!user) {
  throw new NotFoundError('Usuário não encontrado');
}

// Validação de credenciais
if (!isPasswordValid) {
  throw new UnauthorizedError('Credenciais inválidas');
}
```

### Autenticação e Criptografia

```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appConfig from '@/configs/app.config';

// Hash de senha
const passwordHash = await bcrypt.hash(userData.password, 10);

// Verificação de senha
const isPasswordValid = await bcrypt.compare(password, user.password);

// Geração de JWT
const token = jwt.sign({ id: user.id }, appConfig.jwtSecret, {
  expiresIn: appConfig.jwtExpiration,
});
```

## Exemplo de Implementação

### Auth Service

```typescript
// auth.service.ts
import appConfig from '@/configs/app.config';
import { NotFoundError, UnauthorizedError } from '@/utils/core/app-error.utils';
import UserRepository from '@/repositories/v1/modules/auth/user.repository';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  LoginInput,
  RegisterInput,
} from '@/validations/v1/modules/auth.validations';

export class AuthService {
  async login(data: LoginInput) {
    const user = await UserRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const token = jwt.sign({ id: user.id }, appConfig.jwtSecret, {
      expiresIn: appConfig.jwtExpiration,
    });

    return { token };
  }

  async register(data: RegisterInput) {
    const userData: RegisterInput = data;
    const passwordHash = await bcrypt.hash(userData.password, 10);

    const user = await UserRepository.create({
      ...userData,
      password: passwordHash,
    });

    return user;
  }

  async me(userId: number) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return user;
  }
}

export default new AuthService();
```

### Role Service

```typescript
// role.service.ts
import RoleRepository from '@/repositories/v1/modules/role/role.repository';
import { NotFoundError } from '@/utils/core/app-error.utils';
import { CreateRoleInput } from '@/validations/v1/modules/role.validations';

export class RoleService {
  async create(roleData: CreateRoleInput) {
    const role = await RoleRepository.create(roleData);
    return role;
  }

  async show(id: number) {
    const role = await RoleRepository.findById(id);

    if (!role) {
      throw new NotFoundError('Role não encontrada');
    }

    return role;
  }

  async update(id: number, roleData: CreateRoleInput) {
    const role = await RoleRepository.findById(id);

    if (!role) {
      throw new NotFoundError('Role não encontrada');
    }

    const updatedRole = await RoleRepository.update(id, roleData);
    return updatedRole;
  }

  async delete(id: number) {
    const role = await RoleRepository.findById(id);

    if (!role) {
      throw new NotFoundError('Role não encontrada');
    }

    await RoleRepository.delete(id);
    return true;
  }

  async findAll() {
    const roles = await RoleRepository.findAll();
    return roles;
  }
}

export default new RoleService();
```

### Permission Service

```typescript
// permission.service.ts
import PermissionRepository from '@/repositories/v1/modules/permission/permission.repository';
import { NotFoundError } from '@/utils/core/app-error.utils';
import { CreatePermissionInput } from '@/validations/v1/modules/permission.validations';

export class PermissionService {
  async create(permissionData: CreatePermissionInput) {
    const permission = await PermissionRepository.create(permissionData);
    return permission;
  }

  async show(id: number) {
    const permission = await PermissionRepository.findById(id);

    if (!permission) {
      throw new NotFoundError('Permissão não encontrada');
    }

    return permission;
  }

  async update(id: number, permissionData: CreatePermissionInput) {
    const permission = await PermissionRepository.findById(id);

    if (!permission) {
      throw new NotFoundError('Permissão não encontrada');
    }

    const updatedPermission = await PermissionRepository.update(
      id,
      permissionData,
    );
    return updatedPermission;
  }

  async delete(id: number) {
    const permission = await PermissionRepository.findById(id);

    if (!permission) {
      throw new NotFoundError('Permissão não encontrada');
    }

    await PermissionRepository.delete(id);
    return true;
  }

  async findAll() {
    const permissions = await PermissionRepository.findAll();
    return permissions;
  }
}

export default new PermissionService();
```

### Role-Permission Service

```typescript
// role-permission.service.ts
import RolePermissionRepository from '@/repositories/v1/modules/role-permission/role-permission.repository';
import PermissionRepository from '@/repositories/v1/modules/permission/permission.repository';
import { NotFoundError } from '@/utils/core/app-error.utils';

export class RolePermissionService {
  async attach(roleId: number, permissionId: number) {
    const permission = await PermissionRepository.findById(permissionId);

    if (!permission) {
      throw new NotFoundError('Permissão não encontrada');
    }

    const rolePermission = await RolePermissionRepository.attach(
      roleId,
      permissionId,
    );
    return rolePermission;
  }

  async detach(roleId: number, permissionId: number) {
    await RolePermissionRepository.detach(roleId, permissionId);
  }

  async all(roleId: number) {
    const permissions = await RolePermissionRepository.findAllByRoleId(roleId);
    return permissions;
  }
}

export default new RolePermissionService();
```

## Integração com Controllers

Os serviços são consumidos pelos controllers:

```typescript
// Em um controller
import AuthService from '@/services/v1/modules/auth/auth.service';
import RoleService from '@/services/v1/modules/role/role.service';

export class AuthController {
  async login(req: Request<{}, {}, LoginInput>, res: Response) {
    const result = await AuthService.login(req.body);
    res.status(StatusCode.OK).json({
      message: 'Login realizado com sucesso.',
      token: {
        accessToken: result.token,
        expiresIn: appConfig.jwtExpiration,
        tokenType: 'Bearer',
      },
    });
  }

  async register(req: Request<{}, {}, RegisterInput>, res: Response) {
    const user = await AuthService.register(req.body);
    res.status(StatusCode.OK).json({
      message: 'Usuário criado com sucesso.',
      user: UserResource.toResponse(user),
    });
  }

  async me(req: Request, res: Response) {
    const user = await AuthService.me(req.userId);
    res.status(StatusCode.OK).json({
      message: 'Usuário encontrado com sucesso.',
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

  async show(req: Request, res: Response) {
    const role = await RoleService.show(Number(req.params.id));
    res.status(StatusCode.OK).json({
      message: 'Role encontrada com sucesso.',
      data: RoleResource.toResponse(role),
    });
  }
}
```

## Características Técnicas

### Arquitetura de Serviços

- **Organização Modular**: Cada domínio tem seu próprio service
- **Separação de Responsabilidades**: Lógica específica para cada entidade
- **Reutilização**: Services podem ser consumidos por múltiplos controllers

### Tratamento de Erros

- **Erros Específicos**: `NotFoundError`, `UnauthorizedError`, etc.
- **Validações de Negócio**: Verificações antes de operações críticas
- **Mensagens Claras**: Erros com descrições específicas do domínio

### Segurança e Autenticação

- **Criptografia**: Hash de senhas com bcrypt
- **JWT**: Tokens para autenticação de usuários
- **Validação de Credenciais**: Verificação segura de login

### Operações CRUD

- **Create**: Criação com validações
- **Read**: Leitura com verificação de existência
- **Update**: Atualização com validações
- **Delete**: Remoção com verificação de existência
- **List**: Busca de múltiplos registros

## Boas Práticas Implementadas

- ✅ **Foco em Domínio**: Cada service gerencia uma entidade específica
- ✅ **Responsabilidade Única**: Métodos pequenos e focados
- ✅ **Tratamento de Erros**: Erros específicos com mensagens claras
- ✅ **Validações de Negócio**: Verificações antes de operações críticas
- ✅ **Organização Modular**: Estrutura clara por domínio
- ✅ **Reutilização**: Services consumidos por múltiplos controllers
- ✅ **Segurança**: Criptografia e validação de credenciais
- ✅ **Padrão CRUD**: Operações consistentes em todos os services

## Convenções de Nomenclatura

- **Services**: `[Entity]Service` (ex: `AuthService`, `RoleService`)
- **Métodos**: `create`, `show`, `update`, `delete`, `findAll`
- **Arquivos**: `[entity].service.ts`
- **Pastas**: Nome do domínio em minúsculo (ex: `auth`, `role`)
- **Instâncias**: Exportação como instância única (ex: `export default new AuthService()`)

## Dependências

- **Repositories**: Para acesso aos dados
- **Validations**: Para validação de entrada
- **Utils**: Para classes de erro personalizadas
- **Configs**: Para configurações da aplicação
- **bcrypt**: Para criptografia de senhas
- **jsonwebtoken**: Para geração de tokens JWT

## Fluxo de Dados

### Operação de Login

```
Controller → AuthService → UserRepository → Database
                ↓
            JWT Token + Validações
                ↓
            Response com Token
```

### Operação CRUD

```
Controller → [Entity]Service → [Entity]Repository → Database
                ↓
            Validações de Negócio
                ↓
            Response com Dados
```

### Tratamento de Erros

```
Service → Validação → Repository
    ↓
Erro de Negócio → Controller → Response de Erro
```

## Segurança e Validação

### Autenticação

- **Hash de Senhas**: Criptografia com bcrypt (salt rounds: 10)
- **JWT Tokens**: Tokens seguros com expiração configurável
- **Validação de Credenciais**: Verificação segura de email/senha

### Validação de Negócio

- **Verificação de Existência**: Validação antes de operações
- **Regras de Domínio**: Lógica específica para cada entidade
- **Tratamento de Conflitos**: Verificação de dados duplicados

### Controle de Acesso

- **Verificação de Permissões**: Validação de acesso por recurso
- **Middleware de Auth**: Proteção de rotas sensíveis
- **Validação de Usuário**: Verificação de usuário autenticado
