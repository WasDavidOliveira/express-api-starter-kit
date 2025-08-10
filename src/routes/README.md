# Routes da API

Esta pasta contém a definição de todas as rotas da aplicação, organizando os endpoints disponíveis e conectando-os aos respectivos controllers. As rotas definem os caminhos da API, os verbos HTTP aceitos e os middlewares específicos para cada endpoint.

## Conceito

As rotas atuam como o ponto de entrada da aplicação, definindo a interface pública da API e direcionando o fluxo das requisições para os controllers apropriados. Elas:

- Definem URLs e verbos HTTP disponíveis
- Aplicam middlewares específicos a cada rota
- Agrupam endpoints relacionados
- Implementam versionamento da API

## Estrutura da Pasta

```
routes/
├── index.ts              # Registra e exporta todas as rotas
├── v1/                   # Versão 1 da API
│   ├── index.ts          # Agrupa todas as rotas da v1
│   └── [entity].routes.ts # Rotas específicas por entidade
└── v2/                   # Versão 2 da API (quando necessário)
    └── ...
```

## Responsabilidades

As rotas são responsáveis por:

- Definir os endpoints disponíveis na API
- Especificar os verbos HTTP aceitos (GET, POST, PUT, DELETE, etc.)
- Aplicar middlewares específicos (autenticação, validação, etc.)
- Conectar as requisições aos controllers apropriados
- Implementar o versionamento da API
- Agrupar endpoints relacionados

## Exemplo de Implementação

```typescript
// users.routes.ts
import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';
import { validateRequest } from '@/middlewares/validate-request.middlewares';
import { authMiddleware } from '@/middlewares/auth.middlewares';
import { createUserSchema, updateUserSchema } from '@/validations/user.validations';

export const userRouter = Router();
const userController = new UserController();

userRouter.get('/', authMiddleware, userController.listUsers);
userRouter.get('/:id', authMiddleware, userController.getUser);
userRouter.post('/', validateRequest(createUserSchema), userController.createUser);
userRouter.put('/:id', 
  authMiddleware,
  validateRequest(updateUserSchema), 
  userController.updateUser
);
userRouter.delete('/:id', authMiddleware, userController.deleteUser);
```

## Configuração Central de Rotas

O arquivo principal de rotas combina todas as rotas específicas:

```typescript
// routes/v1/index.ts
import { Router } from 'express';
import { userRouter } from './user.routes';
import { authRouter } from './auth.routes';
import { productRouter } from './product.routes';

export const v1Router = Router();

v1Router.use('/users', userRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/products', productRouter);
```

```typescript
// routes/index.ts
import { Router } from 'express';
import { v1Router } from './v1';

export const router = Router();

router.use('/v1', v1Router);
// Adicione novas versões conforme necessário
// router.use('/v2', v2Router);
```

## Boas Práticas

- Use nomes de recursos no plural (users, products)
- Mantenha as rotas RESTful e consistentes
- Agrupe rotas relacionadas sob o mesmo prefixo
- Implemente versionamento para manter compatibilidade
- Aplique middlewares de autenticação e validação adequados
- Documente todas as rotas com comentários ou anotações para a documentação OpenAPI
- Utilize verbos HTTP de forma semântica e consistente (GET para leitura, POST para criação, etc.)
- Implemente tratamento adequado de erros e respostas de status HTTP 