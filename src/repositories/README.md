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
├── index.ts                 # Exporta todos os repositórios
├── base.repository.ts       # Implementação base com métodos comuns (CRUD)
└── [entity]/                # Subpastas por entidade
    ├── [entity].repository.ts   # Implementação específica do repositório
    └── [entity].types.ts        # Tipos e interfaces específicos
```

## Responsabilidades

Os repositórios são responsáveis por:

- Executar operações CRUD (Create, Read, Update, Delete)
- Implementar queries complexas e específicas
- Traduzir dados entre o formato do banco de dados e objetos de domínio
- Gerenciar transações quando necessário
- Tratar erros específicos de banco de dados

## Exemplo de Implementação

```typescript
// user.repository.ts
import { BaseRepository } from '../base.repository';
import { User, UserCreate } from './user.types';
import { db } from '@/db';

export class UserRepository extends BaseRepository<User, UserCreate> {
  constructor() {
    super('users');
  }

  async findByEmail(email: string): Promise<User | null> {
    return await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email)
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await db.update(this.table).set({
      lastLoginAt: new Date()
    }).where(eq(this.table.id, userId));
  }
}

export const userRepository = new UserRepository();
```

## Integração com Serviços

Os repositórios são consumidos pelos serviços, que implementam a lógica de negócios:

```typescript
// Em um service
import { userRepository } from '@/repositories/user/user.repository';

export class AuthService {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    // Lógica de autenticação...
    await userRepository.updateLastLogin(user.id);
    return user;
  }
}
```

## Boas Práticas

- Mantenha os repositórios focados em uma única entidade
- Implemente métodos específicos para consultas complexas
- Evite lógica de negócios nos repositórios
- Use transações para operações que afetam múltiplas tabelas
- Trate erros de banco de dados e lance exceções compreensíveis
- Implemente paginação para consultas que retornam grandes conjuntos de dados 