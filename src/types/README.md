# Types

Este diretório contém definições de tipos TypeScript utilizados em toda a aplicação.

## Estrutura

```
types/
├── express/             # Tipos para extensão do Express
│   └── index.d.ts       # Extensão da interface Request do Express
├── models/              # Tipos relacionados a modelos de dados
│   └── v1/              # Tipos para modelos da API v1
│       └── auth.types.ts  # Tipos para autenticação e usuários
├── errors.types.ts      # Tipos para tratamento de erros
└── jwt.types.ts         # Tipos para tokens JWT
```

## Descrição

### Express

Este diretório contém declarações para estender as interfaces nativas do Express. 
Por exemplo, `index.d.ts` adiciona a propriedade `userId` à interface Request do Express.

### Models

Contém tipos para os modelos de dados usados na aplicação:

- **v1**: Tipos específicos para a versão 1 da API
  - **auth.types.ts**: Define tipos relacionados à autenticação e usuários (UserModel, CreateUserModel)

### Arquivos Individuais

- **errors.types.ts**: Define tipos relacionados a erros, como `PostgresError` para erros específicos do PostgreSQL e `ValidationErrorItem` para erros de validação.
- **jwt.types.ts**: Define o formato do payload para tokens JWT (`JwtPayload`).

## Uso

Estes tipos devem ser importados e utilizados em todo o código para garantir consistência e type safety na aplicação.

Exemplo:

```typescript
import { JwtPayload } from '@/types/jwt.types';
import { ValidationErrorItem } from '@/types/errors.types';
``` 