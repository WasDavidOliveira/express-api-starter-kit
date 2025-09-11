# Routes da API

Esta pasta contém a definição de todas as rotas da aplicação, organizando os endpoints disponíveis e conectando-os aos respectivos controllers. As rotas definem os caminhos da API, os verbos HTTP aceitos e os middlewares específicos para cada endpoint.

## Conceito

As rotas atuam como o ponto de entrada da aplicação, definindo a interface pública da API e direcionando o fluxo das requisições para os controllers apropriados. Elas:

- Definem URLs e verbos HTTP disponíveis
- Aplicam middlewares específicos a cada rota
- Agrupam endpoints relacionados por domínio
- Implementam versionamento da API
- Gerenciam autenticação e autorização

## Estrutura da Pasta

```
routes/
├── README.md                    # Esta documentação
├── router.ts                    # Router principal da aplicação
└── v1/                         # Versão 1 da API
    ├── v1.routes.ts            # Agrupa todas as rotas da v1
    └── modules/                # Módulos organizados por domínio
        ├── auth/               # Módulo de autenticação
        │   ├── auth.routes.ts
        │   └── index.ts
        ├── role/               # Módulo de roles
        │   ├── roles.routes.ts
        │   └── index.ts
        ├── permission/         # Módulo de permissões
        │   ├── permission.routes.ts
        │   └── index.ts
        ├── role-permission/    # Módulo de relacionamento role-permissão
        │   ├── role-permission.routes.ts
        │   └── index.ts
        └── index.ts            # Exportação centralizada dos módulos
```

## Módulos Disponíveis

### 🔐 **Auth Module** (`auth/`)

Rotas de autenticação e registro de usuários:

- **`auth.routes.ts`**: Endpoints de autenticação
  - `POST /login`: Login de usuário
  - `POST /register`: Registro de novo usuário
  - `GET /me`: Obter dados do usuário autenticado

### 🛡️ **Role Module** (`role/`)

Rotas para gerenciamento de roles:

- **`roles.routes.ts`**: Endpoints de roles
  - `POST /`: Criar nova role
  - `GET /all`: Listar todas as roles
  - `GET /:id`: Obter role específica
  - `PUT /:id`: Atualizar role
  - `DELETE /:id`: Deletar role

### 🔑 **Permission Module** (`permission/`)

Rotas para gerenciamento de permissões:

- **`permission.routes.ts`**: Endpoints de permissões
  - `POST /`: Criar nova permissão
  - `GET /:id`: Obter permissão específica
  - `PUT /:id`: Atualizar permissão
  - `DELETE /:id`: Deletar permissão

### 🔗 **Role-Permission Module** (`role-permission/`)

Rotas para gerenciar relacionamentos entre roles e permissões:

- **`role-permission.routes.ts`**: Endpoints de relacionamento
  - `GET /:roleId/all`: Listar permissões de uma role
  - `POST /attach`: Vincular permissão a uma role
  - `POST /detach`: Desvincular permissão de uma role

## Responsabilidades

As rotas são responsáveis por:

- Definir os endpoints disponíveis na API
- Especificar os verbos HTTP aceitos (GET, POST, PUT, DELETE, etc.)
- Aplicar middlewares específicos (autenticação, validação, autorização)
- Conectar as requisições aos controllers apropriados
- Implementar o versionamento da API
- Agrupar endpoints relacionados por domínio
- Gerenciar permissões e controle de acesso

## Padrão de Implementação

### Estrutura Base das Rotas

```typescript
import { Router } from 'express';
import [Entity]Controller from '@/controllers/v1/modules/[entity]/[entity].controller';
import { [action][Entity]Schema } from '@/validations/v1/modules/[entity].validations';
import { validateRequest } from '@/middlewares/validation/validate-request.middlewares';
import { hasPermission } from '@/middlewares/authorization/permission.middleware';
import { PermissionActions } from '@/constants/permission.constants';

const router = Router();

router.post(
  '/',
  hasPermission('[entity]', PermissionActions.CREATE),
  validateRequest(create[Entity]Schema),
  [Entity]Controller.create
);

export default router;
```

### Middlewares Aplicados

```typescript
// Autenticação
router.use('/permissions', authMiddleware, permissionRoutes);

// Validação de dados
router.post(
  '/register',
  validateRequest(registerSchema),
  AuthController.register,
);

// Autorização por permissão
router.get(
  '/all',
  hasPermission('role', PermissionActions.READ),
  RoleController.index,
);
```

## Exemplo de Implementação

### Auth Routes

```typescript
// auth.routes.ts
import { Router } from 'express';
import AuthController from '@/controllers/v1/modules/auth/auth.controller';
import {
  registerSchema,
  loginSchema,
} from '@/validations/v1/modules/auth.validations';
import { validateRequest } from '@/middlewares/validation/validate-request.middlewares';
import { authMiddleware } from '@/middlewares/auth/auth.middlewares';

const router: Router = Router();

router.post('/login', validateRequest(loginSchema), AuthController.login);

router.post(
  '/register',
  validateRequest(registerSchema),
  AuthController.register,
);

router.get('/me', authMiddleware, AuthController.me);

export default router;
```

### Role Routes

```typescript
// roles.routes.ts
import { Router } from 'express';
import RoleController from '@/controllers/v1/modules/role/role.controller';
import {
  createRoleSchema,
  updateRoleSchema,
} from '@/validations/v1/modules/role.validations';
import { validateRequest } from '@/middlewares/validation/validate-request.middlewares';
import { hasPermission } from '@/middlewares/authorization/permission.middleware';
import { PermissionActions } from '@/constants/permission.constants';

const router = Router();

router.post(
  '/',
  hasPermission('role', PermissionActions.CREATE),
  validateRequest(createRoleSchema),
  RoleController.create,
);

router.get(
  '/all',
  hasPermission('role', PermissionActions.READ),
  RoleController.index,
);

router.get(
  '/:id',
  hasPermission('role', PermissionActions.READ),
  RoleController.show,
);

router.put(
  '/:id',
  hasPermission('role', PermissionActions.UPDATE),
  validateRequest(updateRoleSchema),
  RoleController.update,
);

router.delete(
  '/:id',
  hasPermission('role', PermissionActions.DELETE),
  RoleController.delete,
);

export default router;
```

### Permission Routes

```typescript
// permission.routes.ts
import { Router } from 'express';
import PermissionController from '@/controllers/v1/modules/permission/permission.controller';
import {
  createPermissionSchema,
  updatePermissionSchema,
} from '@/validations/v1/modules/permission.validations';
import { validateRequest } from '@/middlewares/validation/validate-request.middlewares';
import { hasPermission } from '@/middlewares/authorization/permission.middleware';
import { PermissionActions } from '@/constants/permission.constants';

const router = Router();

router.post(
  '/',
  hasPermission('user', PermissionActions.CREATE),
  validateRequest(createPermissionSchema),
  PermissionController.create,
);

router.get(
  '/:id',
  hasPermission('user', PermissionActions.READ),
  PermissionController.show,
);

router.put(
  '/:id',
  hasPermission('user', PermissionActions.UPDATE),
  validateRequest(updatePermissionSchema),
  PermissionController.update,
);

router.delete(
  '/:id',
  hasPermission('user', PermissionActions.DELETE),
  PermissionController.delete,
);

export default router;
```

### Role-Permission Routes

```typescript
// role-permission.routes.ts
import { Router } from 'express';
import RolePermissionController from '@/controllers/v1/modules/role-permission/role-permission.controller';
import { authMiddleware } from '@/middlewares/auth/auth.middlewares';

const router = Router();

router.get('/:roleId/all', authMiddleware, RolePermissionController.all);

router.post('/attach', authMiddleware, RolePermissionController.attach);

router.post('/detach', authMiddleware, RolePermissionController.detach);

export default router;
```

## Configuração Central de Rotas

### Router Principal da Aplicação

```typescript
// routes/router.ts
import { Router } from 'express';
import v1Routes from '@/routes/v1/v1.routes';

const router: Router = Router();

router.use('/api/v1', v1Routes);

export default router;
```

### Agrupamento das Rotas v1

```typescript
// routes/v1/v1.routes.ts
import { Router } from 'express';
import authRoutes from '@/routes/v1/modules/auth/auth.routes';
import permissionRoutes from '@/routes/v1/modules/permission/permission.routes';
import { authMiddleware } from '@/middlewares/auth/auth.middlewares';
import rolePermissionRoutes from '@/routes/v1/modules/role-permission/role-permission.routes';
import roleRoutes from '@/routes/v1/modules/role/roles.routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/permissions', authMiddleware, permissionRoutes);
router.use('/roles', authMiddleware, roleRoutes);
router.use('/roles-permissions', authMiddleware, rolePermissionRoutes);

export default router;
```

## Características Técnicas

### Estrutura Modular

- **Organização por Domínio**: Cada módulo tem suas próprias rotas
- **Separação de Responsabilidades**: Rotas específicas para cada entidade
- **Reutilização**: Middlewares aplicados de forma consistente

### Middlewares Implementados

- **Autenticação**: `authMiddleware` para rotas protegidas
- **Validação**: `validateRequest` com schemas Zod
- **Autorização**: `hasPermission` para controle de acesso granular

### Versionamento

- **API v1**: Estrutura atual implementada
- **Extensibilidade**: Preparado para futuras versões
- **Compatibilidade**: Manutenção de versões anteriores

## Endpoints Disponíveis

### 🔐 **Autenticação** (`/api/v1/auth`)

- `POST /login` - Login de usuário
- `POST /register` - Registro de usuário
- `GET /me` - Dados do usuário autenticado

### 🛡️ **Roles** (`/api/v1/roles`)

- `POST /` - Criar role
- `GET /all` - Listar todas as roles
- `GET /:id` - Obter role específica
- `PUT /:id` - Atualizar role
- `DELETE /:id` - Deletar role

### 🔑 **Permissões** (`/api/v1/permissions`)

- `POST /` - Criar permissão
- `GET /:id` - Obter permissão específica
- `PUT /:id` - Atualizar permissão
- `DELETE /:id` - Deletar permissão

### 🔗 **Role-Permissões** (`/api/v1/roles-permissions`)

- `GET /:roleId/all` - Listar permissões de uma role
- `POST /attach` - Vincular permissão a role
- `POST /detach` - Desvincular permissão de role

## Boas Práticas Implementadas

- ✅ **Organização Modular**: Rotas organizadas por domínio de negócio
- ✅ **Versionamento**: Estrutura preparada para múltiplas versões da API
- ✅ **Middleware Consistente**: Aplicação uniforme de autenticação e validação
- ✅ **Controle de Acesso**: Autorização granular com permissões
- ✅ **Validação de Dados**: Schemas Zod para validação de entrada
- ✅ **Estrutura RESTful**: Endpoints seguindo convenções REST
- ✅ **Separação de Responsabilidades**: Cada módulo gerencia suas próprias rotas
- ✅ **Reutilização**: Middlewares aplicados de forma consistente

## Convenções de Nomenclatura

- **Arquivos de Rotas**: `[entity].routes.ts` ou `[entity]-[entity].routes.ts`
- **Endpoints**: Nomes no plural para recursos (ex: `/roles`, `/permissions`)
- **Verbos HTTP**: Uso semântico (GET para leitura, POST para criação, etc.)
- **Parâmetros**: `:id` para identificadores únicos
- **Módulos**: Nomes descritivos do domínio (ex: `auth`, `role`, `permission`)

## Dependências

- **Express**: Framework web para roteamento
- **Controllers**: Para lógica de negócio dos endpoints
- **Middlewares**: Para autenticação, validação e autorização
- **Validations**: Schemas Zod para validação de entrada
- **Constants**: Para ações de permissão e outras constantes

## Segurança e Controle de Acesso

### Autenticação

- **Middleware de Auth**: Aplicado em rotas protegidas
- **JWT**: Tokens para autenticação de usuários
- **Sessão**: Verificação de usuário autenticado

### Autorização

- **Controle Granular**: Permissões específicas por ação
- **Middleware de Permissão**: Verificação de acesso por recurso
- **Ações Padrão**: CREATE, READ, UPDATE, DELETE

### Validação

- **Schemas Zod**: Validação de dados de entrada
- **Middleware de Validação**: Aplicação consistente de validação
- **Sanitização**: Prevenção de dados maliciosos
