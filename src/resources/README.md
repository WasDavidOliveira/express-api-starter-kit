# Resources da API

Esta pasta contém os recursos da aplicação, que definem a estrutura e o comportamento dos diferentes recursos expostos pela API. Cada recurso representa uma entidade de negócio ou conceito que pode ser manipulado através dos endpoints da API.

## Conceito

Os recursos definem a camada de modelo e transformação de dados da aplicação, servindo como a representação canônica das entidades para consumo externo. Eles são responsáveis por:

- Definir a estrutura dos dados retornados pela API
- Prover métodos de transformação e serialização
- Encapsular a lógica de apresentação e formatação de dados

## Estrutura da Pasta

```
resources/
├── index.ts                  # Exporta todos os recursos
├── base.resource.ts          # Classe base com métodos comuns de transformação
└── [entity]/                 # Subpastas por entidade
    ├── [entity].resource.ts  # Implementação do recurso específico
    └── [entity].types.ts     # Tipos e interfaces específicos do recurso
```

## Responsabilidades

Os recursos são responsáveis por:

- Definir a estrutura dos objetos retornados pela API
- Transformar objetos de domínio em representações para API
- Ocultar campos sensíveis ou internos
- Formatar datas, números e outros tipos de dados
- Adicionar links e metadados relevantes (HATEOAS)
- Versionar representações de recursos

## Exemplo de Implementação

```typescript
// user.resource.ts
import { BaseResource } from '../base.resource';
import { User } from '@/types/user.types';
import { UserResponse } from './user.types';

export class UserResource extends BaseResource<User, UserResponse> {
  transform(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: this.formatDate(user.createdAt),
      updatedAt: this.formatDate(user.updatedAt),
      // Note que omitimos dados sensíveis como senha
    };
  }

  transformCollection(users: User[]): UserResponse[] {
    return users.map(user => this.transform(user));
  }
}

export const userResource = new UserResource();
```

## Integração com Controllers

Os recursos são utilizados pelos controllers para formatar a resposta da API:

```typescript
// Em um controller
import { userResource } from '@/resources/user/user.resource';

export class UserController {
  async getUser(req: Request, res: Response) {
    const user = await userService.findById(req.params.id);
    return res.json(userResource.transform(user));
  }

  async listUsers(req: Request, res: Response) {
    const users = await userService.findAll(req.query);
    return res.json({
      data: userResource.transformCollection(users.data),
      meta: users.meta
    });
  }
}
```

## Boas Práticas

- Mantenha os recursos focados em uma única entidade
- Sempre omita dados sensíveis (senhas, tokens)
- Use tipos/interfaces para garantir que a estrutura do recurso seja consistente
- Aplique formatação consistente para datas, números e outros tipos
- Considere implementar diferentes versões de recursos para suportar versionamento de API
- Adicione links para recursos relacionados quando relevante (HATEOAS)
- Utilize camelCase para nomes de propriedades conforme padrões de API REST 