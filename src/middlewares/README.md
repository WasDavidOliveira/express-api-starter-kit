# Middlewares da API

Esta pasta contém os middlewares utilizados pela aplicação para processar requisições HTTP. Os middlewares são funções que têm acesso ao objeto de requisição, ao objeto de resposta e à próxima função middleware no ciclo de requisição-resposta da aplicação.

## Estrutura da Pasta

```
middlewares/
├── core/                         # Middlewares fundamentais da aplicação
│   ├── bootstrap.middleware.ts   # Configuração e registro de middlewares globais
│   ├── error-hander.middleware.ts # Tratamento centralizado de erros
│   ├── rate-limit.middleware.ts  # Limitação de taxa de requisições
│   ├── docs.middleware.ts        # Configuração da documentação OpenAPI
│   └── index.ts
├── auth/                         # Middlewares de autenticação
│   ├── auth.middlewares.ts       # Autenticação JWT
│   └── index.ts
├── authorization/                 # Middlewares de autorização
│   ├── permission.middleware.ts  # Verificação de permissões
│   ├── role.middleware.ts        # Verificação de roles
│   └── index.ts
├── validation/                   # Middlewares de validação
│   ├── validate-request.middlewares.ts # Validação de dados com Zod
│   └── index.ts
└── index.ts                      # Exportação centralizada
```

## Módulos de Middlewares

### 🔧 **Core Module** (`core/`)
Middlewares fundamentais para o funcionamento da aplicação:

- **`bootstrap.middleware.ts`**: Configuração e registro de todos os middlewares globais
- **`error-hander.middleware.ts`**: Tratamento centralizado de erros
- **`rate-limit.middleware.ts`**: Limitação de taxa de requisições
- **`docs.middleware.ts`**: Configuração da documentação OpenAPI

### 🔐 **Auth Module** (`auth/`)
Middlewares de autenticação:

- **`auth.middlewares.ts`**: Autenticação via JWT (JSON Web Token)

### 🛡️ **Authorization Module** (`authorization/`)
Middlewares de autorização e controle de acesso:

- **`permission.middleware.ts`**: Verificação de permissões específicas
- **`role.middleware.ts`**: Verificação de roles e funções

### ✅ **Validation Module** (`validation/`)
Middlewares de validação de dados:

- **`validate-request.middlewares.ts`**: Validação de dados de entrada com Zod

## Descrição dos Middlewares

### Core Middlewares

#### bootstrap.middleware.ts
Configura e registra todos os middlewares globais da aplicação na ordem correta:
- Configuração de CORS
- Configuração de segurança via Helmet
- Limitação de taxa de requisições
- Processamento de JSON no corpo das requisições
- Documentação da API
- Roteamento da aplicação
- Tratamento de rotas não encontradas
- Tratamento de erros

#### error-hander.middleware.ts
Implementa o tratamento centralizado de erros da aplicação:
- Processa diferentes tipos de erros (validação, aplicação, banco de dados)
- Formata respostas de erro de maneira consistente
- Adiciona informações de depuração em ambiente de desenvolvimento
- Fornece erros amigáveis para o usuário final
- Inclui um handler para rotas não encontradas

#### rate-limit.middleware.ts
Configura a limitação de taxa de requisições para prevenção de abuso:
- Define um limite global de 60 requisições por minuto por IP
- Configura cabeçalhos padrão para informações de limitação
- Fornece mensagens personalizadas quando o limite é excedido

#### docs.middleware.ts
Configura a documentação da API usando Scalar:
- Gera o documento OpenAPI na inicialização do servidor
- Expõe o endpoint `/openapi.json` para acesso à especificação bruta
- Configura a interface interativa em `/docs` para explorar e testar os endpoints

### Auth Middlewares

#### auth.middlewares.ts
Middleware responsável pela autenticação via JWT:
- Verifica a presença do token no cabeçalho Authorization
- Valida o token usando a chave secreta configurada
- Extrai e disponibiliza o ID do usuário na requisição
- Lança erros apropriados para tokens ausentes ou inválidos

### Authorization Middlewares

#### permission.middleware.ts
Middleware para verificação de permissões específicas:
- **`hasPermission`**: Verifica se o usuário tem uma permissão específica
- **`hasAllPermissions`**: Verifica se o usuário tem todas as permissões
- **`hasAnyPermission`**: Verifica se o usuário tem pelo menos uma das permissões

#### role.middleware.ts
Middleware para verificação de roles e funções:
- **`hasRole`**: Verifica se o usuário tem um role específico
- **`hasAnyRole`**: Verifica se o usuário tem pelo menos um dos roles
- **`hasAllRoles`**: Verifica se o usuário tem todos os roles

### Validation Middlewares

#### validate-request.middlewares.ts
Middleware para validação de dados de entrada usando Zod:
- Valida automaticamente o corpo da requisição, parâmetros de consulta e URL
- Estrutura e retorna erros de validação de forma amigável
- Impede o processamento de dados inválidos antes de chegarem aos controladores

## Como Funcionam os Middlewares

Os middlewares são executados em cascata na ordem em que são registrados em `bootstrap.middleware.ts`. Cada middleware pode:

1. Executar qualquer código
2. Fazer alterações nos objetos de requisição e resposta
3. Encerrar o ciclo de requisição-resposta
4. Chamar o próximo middleware na pilha

Se um middleware não encerrar o ciclo de requisição-resposta, ele deve chamar `next()` para passar o controle para o próximo middleware.

## Exemplos de Uso

### Validação de Requisições

```typescript
// Em uma definição de rota
import { validateRequest } from '@/middlewares/validation';
import { meuSchema } from '@/validations/v1/modules/meu-modulo.validations';

router.post('/recurso', validateRequest(meuSchema), meuController.criarRecurso);
```

### Proteção de Rotas com Autenticação

```typescript
// Em uma definição de rota
import { authMiddleware } from '@/middlewares/auth';

router.get('/rota-protegida', authMiddleware, meuController.acessoProtegido);
```

### Proteção de Rotas com Permissões

```typescript
// Em uma definição de rota
import { authMiddleware } from '@/middlewares/auth';
import { hasPermission } from '@/middlewares/authorization';
import { PermissionActions } from '@/constants/permission.constants';
import UserController from '@/controllers/v1/modules/user/user.controller';

router.get(
  '/users',
  authMiddleware,
  hasPermission('users', PermissionActions.READ),
  UserController.index
);
```

### Proteção de Rotas com Roles

```typescript
// Em uma definição de rota
import { authMiddleware } from '@/middlewares/auth';
import { hasRole, hasAnyRole } from '@/middlewares/authorization';
import AdminController from '@/controllers/v1/modules/admin/admin.controller';

const router = Router();

// Rota acessível apenas para administradores
router.get(
  '/admin/dashboard',
  authMiddleware,
  hasRole('admin'),
  AdminController.dashboard
);

// Rota acessível para administradores ou gerentes
router.get(
  '/reports',
  authMiddleware,
  hasAnyRole(['admin', 'manager']),
  AdminController.reports
);
```

## Padrão de Implementação

### Estrutura Base dos Middlewares
```typescript
import { Request, Response, NextFunction } from 'express';

export const meuMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Lógica do middleware
    next();
  } catch (error) {
    next(error);
  }
};
```

### Middleware de Autenticação
```typescript
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    throw new UnauthorizedError('Token não fornecido');
  }
  
  // Validação do token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded.userId;
  
  next();
};
```

### Middleware de Permissões
```typescript
export const hasPermission = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    
    // Verificação de permissão
    const hasAccess = await checkUserPermission(userId, resource, action);
    
    if (!hasAccess) {
      throw new ForbiddenError('Acesso negado');
    }
    
    next();
  };
};
```

## Características Técnicas

### Tratamento de Erros
- Uso consistente de classes de erro personalizadas
- Delegação de erros para o middleware de tratamento centralizado
- Mensagens de erro em português

### Segurança
- Autenticação JWT robusta
- Verificação de permissões granulares
- Controle de acesso baseado em roles
- Limitação de taxa para prevenção de abuso

### Validação
- Validação automática com Zod
- Schemas tipados para entrada de dados
- Tratamento consistente de erros de validação

## Boas Práticas Implementadas

- ✅ Middlewares focados em responsabilidade única
- ✅ Tratamento de erros consistente
- ✅ Organização por funcionalidade (core, auth, authorization, validation)
- ✅ Uso de classes de erro personalizadas
- ✅ Validação robusta com Zod
- ✅ Controle de acesso granular
- ✅ Documentação clara de cada middleware
- ✅ Padrões de nomenclatura consistentes

## Convenções de Nomenclatura

- **Arquivos**: `[funcionalidade].middleware.ts` (ex: `auth.middleware.ts`)
- **Funções**: `[funcionalidade]Middleware` (ex: `authMiddleware`)
- **Pastas**: Nome da funcionalidade em minúsculo (ex: `core`, `auth`)

## Dependências

- **Express**: Framework web para middlewares
- **JWT**: Para autenticação
- **Zod**: Para validação de dados
- **Constants**: Para códigos de erro e permissões
- **Utils**: Para funções utilitárias 