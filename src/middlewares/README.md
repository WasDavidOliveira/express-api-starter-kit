# Middlewares da API

Esta pasta contém os middlewares utilizados pela aplicação para processar requisições HTTP. Os middlewares são funções que têm acesso ao objeto de requisição, ao objeto de resposta e à próxima função middleware no ciclo de requisição-resposta da aplicação.

## Estrutura da Pasta

```
middlewares/
├── application.middlewares.ts    # Configuração e registro de todos os middlewares da aplicação
├── auth.middlewares.ts           # Middleware de autenticação JWT
├── docs.middleware.ts            # Configuração da documentação OpenAPI
├── error-hander.middleware.ts    # Tratamento centralizado de erros
├── rate-limit.middleware.ts      # Limitação de taxa de requisições
└── validate-request.middlewares.ts # Validação de dados de requisição com Zod
```

## Descrição dos Middlewares

### application.middlewares.ts
Este arquivo configura e registra todos os middlewares globais da aplicação na ordem correta:
- Configuração de CORS
- Configuração de segurança via Helmet
- Limitação de taxa de requisições
- Processamento de JSON no corpo das requisições
- Documentação da API
- Roteamento da aplicação
- Tratamento de rotas não encontradas
- Tratamento de erros

### auth.middlewares.ts
Middleware responsável pela autenticação via JWT (JSON Web Token):
- Verifica a presença do token no cabeçalho Authorization
- Valida o token usando a chave secreta configurada
- Extrai e disponibiliza o ID do usuário na requisição
- Lança erros apropriados para tokens ausentes ou inválidos

### docs.middleware.ts
Configura a documentação da API usando Scalar:
- Gera o documento OpenAPI na inicialização do servidor
- Expõe o endpoint `/openapi.json` para acesso à especificação bruta
- Configura a interface interativa em `/docs` para explorar e testar os endpoints

### error-hander.middleware.ts
Implementa o tratamento centralizado de erros da aplicação:
- Processa diferentes tipos de erros (validação, aplicação, banco de dados)
- Formata respostas de erro de maneira consistente
- Adiciona informações de depuração em ambiente de desenvolvimento
- Fornece erros amigáveis para o usuário final
- Inclui um handler para rotas não encontradas

### rate-limit.middleware.ts
Configura a limitação de taxa de requisições para prevenção de abuso:
- Define um limite global de 60 requisições por minuto por IP
- Configura cabeçalhos padrão para informações de limitação
- Fornece mensagens personalizadas quando o limite é excedido

### validate-request.middlewares.ts
Middleware para validação de dados de entrada usando Zod:
- Valida automaticamente o corpo da requisição, parâmetros de consulta e URL
- Estrutura e retorna erros de validação de forma amigável
- Impede o processamento de dados inválidos antes de chegarem aos controladores

## Como Funcionam os Middlewares

Os middlewares são executados em cascata na ordem em que são registrados em `application.middlewares.ts`. Cada middleware pode:

1. Executar qualquer código
2. Fazer alterações nos objetos de requisição e resposta
3. Encerrar o ciclo de requisição-resposta
4. Chamar o próximo middleware na pilha

Se um middleware não encerrar o ciclo de requisição-resposta, ele deve chamar `next()` para passar o controle para o próximo middleware.

## Exemplos de Uso

### Validação de Requisições

```typescript
// Em uma definição de rota
import { validateRequest } from '@/middlewares/validate-request.middlewares';
import { meuSchema } from '@/validations/meu-modulo.validations';

router.post('/recurso', validateRequest(meuSchema), meuController.criarRecurso);
```

### Proteção de Rotas

```typescript
// Em uma definição de rota
import { authMiddleware } from '@/middlewares/auth.middlewares';

router.get('/rota-protegida', authMiddleware, meuController.acessoProtegido);
```

## Boas Práticas

- Mantenha os middlewares focados em uma única responsabilidade
- Evite operações bloqueantes que possam afetar o desempenho da aplicação
- Documente claramente o comportamento e os efeitos colaterais de cada middleware
- Capture e trate erros adequadamente com try/catch ou next(error)
- Utilize o sistema de logs para registrar eventos importantes durante o processamento

# Middlewares

Esta pasta contém os middlewares utilizados na aplicação.

## Middlewares Disponíveis

- **auth.middleware.ts**: Middleware para autenticação de usuários
- **role.middleware.ts**: Middleware para verificação de funções (roles) de usuários
- **permission.middleware.ts**: Middleware para verificação de permissões
- **validate-request.middlewares.ts**: Middleware para validação de requisições
- **error-handler.middleware.ts**: Middleware para tratamento de erros
- **rate-limit.middleware.ts**: Middleware para limitação de requisições
- **docs.middleware.ts**: Middleware para documentação da API
- **application.middlewares.ts**: Configuração de middlewares globais da aplicação

## Exemplos de Uso

### Middleware de Autenticação

```typescript
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middlewares';
import UserController from '@/controllers/v1/user.controller';

const router = Router();

router.get('/profile', authMiddleware, UserController.profile);

export default router;
```

### Middleware de Permissões

```typescript
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middlewares';
import { hasPermission } from '@/middlewares/permission.middleware';
import { PermissionActions } from '@/constants/permission.constants';
import UserController from '@/controllers/v1/user.controller';

const router = Router();

router.get(
  '/users',
  authMiddleware,
  hasPermission('users', PermissionActions.READ),
  UserController.index
);

export default router;
```

### Middleware de Funções (Roles)

```typescript
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middlewares';
import { hasRole, hasAnyRole } from '@/middlewares/role.middleware';
import AdminController from '@/controllers/v1/admin.controller';

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

export default router;
```

### Middleware de Validação de Requisições

```typescript
import { Router } from 'express';
import { validateRequest } from '@/middlewares/validate-request.middlewares';
import { createUserSchema } from '@/validations/v1/user.validations';
import UserController from '@/controllers/v1/user.controller';

const router = Router();

router.post(
  '/users',
  validateRequest(createUserSchema),
  UserController.store
);

export default router;
``` 