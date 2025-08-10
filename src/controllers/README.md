# Controllers da API

Esta pasta contém os controllers da aplicação, que são responsáveis por receber requisições HTTP, processar os dados de entrada, coordenar com os serviços e retornar respostas adequadas. Os controllers atuam como a camada de apresentação da API.

## Conceito

Os controllers implementam a interface entre o cliente e a lógica de negócios da aplicação. Eles são responsáveis por:

- Receber e validar dados de entrada
- Delegar o processamento para os serviços apropriados
- Formatar e retornar respostas HTTP
- Gerenciar o fluxo de requisição e resposta

## Estrutura da Pasta

```
controllers/
├── README.md                     # Esta documentação
└── v1/                          # Versão 1 da API
    └── modules/                 # Módulos organizados por domínio
        ├── auth/                # Módulo de autenticação
        │   ├── auth.controller.ts
        │   └── index.ts
        ├── role/                # Módulo de roles
        │   ├── role.controller.ts
        │   └── index.ts
        ├── permission/          # Módulo de permissões
        │   ├── permission.controller.ts
        │   └── index.ts
        ├── role-permission/     # Módulo de relacionamento role-permissão
        │   ├── role-permission.controller.ts
        │   └── index.ts
        └── index.ts             # Exportação centralizada dos módulos
```

## Módulos Disponíveis

### 🔐 **Auth Module** (`auth/`)
- **`login`**: Autenticação de usuário
- **`register`**: Criação de novo usuário
- **`me`**: Obter dados do usuário autenticado

### 🛡️ **Role Module** (`role/`)
- **`create`**: Criar nova role
- **`show`**: Exibir role específica
- **`update`**: Atualizar role existente
- **`delete`**: Remover role
- **`index`**: Listar todas as roles

### 🔑 **Permission Module** (`permission/`)
- **`create`**: Criar nova permissão
- **`show`**: Exibir permissão específica
- **`update`**: Atualizar permissão existente
- **`delete`**: Remover permissão

### 🔗 **Role-Permission Module** (`role-permission/`)
- **`attach`**: Associar permissão a uma role
- **`detach`**: Remover permissão de uma role
- **`all`**: Listar todas as permissões de uma role

## Responsabilidades

Os controllers são responsáveis por:

- Extrair e validar dados de entrada (body, query, params)
- Delegar o processamento para os serviços apropriados
- Formatar respostas de sucesso usando recursos (Resources)
- Tratar erros e retornar códigos HTTP apropriados
- Implementar padrão de resposta consistente com mensagens
- Controlar códigos de status HTTP usando constantes

## Padrão de Implementação

### Estrutura Base
```typescript
export class [Entity]Controller {
  [method] = catchAsync(
    async (req: Request, res: Response) => {
      // 1. Extrair dados da requisição
      // 2. Chamar serviço apropriado
      // 3. Formatar resposta usando Resource
      // 4. Retornar resposta com status adequado
    }
  );
}

export default new [Entity]Controller();
```

### Padrão de Resposta
```typescript
// Resposta de sucesso com dados
res.status(StatusCode.OK).json({
  message: 'Mensagem de sucesso.',
  data: Resource.toResponse(data)
});

// Resposta de sucesso sem dados
res.status(StatusCode.OK).json({
  message: 'Operação realizada com sucesso.'
});
```

## Exemplo de Implementação

```typescript
// role.controller.ts
import { Request, Response } from 'express';
import { catchAsync } from '@/utils/infrastructure/catch-async.utils';
import RoleService from '@/services/v1/modules/role/role.service';
import { StatusCode } from '@/constants/status-code.constants';
import { CreateRoleInput } from '@/validations/v1/modules/role.validations';
import { RoleResource } from '@/resources/v1/modules/role/role.resource';

export class RoleController {
  create = catchAsync(
    async (req: Request<{}, {}, CreateRoleInput>, res: Response) => {
      const roleData: CreateRoleInput = req.body;

      const role = await RoleService.create(roleData);

      res.status(StatusCode.CREATED).json({
        message: 'Role criada com sucesso.',
        data: RoleResource.toResponse(role),
      });
    }
  );

  show = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const role = await RoleService.show(Number(id));

    res.status(StatusCode.OK).json({
      message: 'Role encontrada com sucesso.',
      data: RoleResource.toResponse(role),
    });
  });

  // ... outros métodos
}

export default new RoleController();
```

## Características Técnicas

### Tratamento de Erros
- Uso do `catchAsync` para captura automática de erros
- Delegação de erros para o middleware de tratamento de erros
- Não há try-catch explícito nos controllers

### Validação de Dados
- Tipagem forte com TypeScript
- Validação de entrada usando schemas Zod
- Conversão automática de tipos (ex: `Number(id)`)

### Formatação de Resposta
- Uso consistente de Resources para transformação de dados
- Mensagens padronizadas em português
- Estrutura de resposta consistente

### Códigos de Status
- Uso de constantes para códigos HTTP
- Status apropriados para cada operação (200, 201, 204)

## Boas Práticas Implementadas

- ✅ Controllers enxutos com responsabilidade única
- ✅ Uso do `catchAsync` para tratamento de erros
- ✅ Formatação consistente de respostas
- ✅ Uso de Resources para transformação de dados
- ✅ Tipagem forte com TypeScript
- ✅ Padrão de mensagens em português
- ✅ Organização modular por domínio
- ✅ Uso de constantes para códigos de status
- ✅ Padrão de exportação consistente

## Convenções de Nomenclatura

- **Controllers**: `[Entity]Controller` (ex: `RoleController`)
- **Métodos**: Verbos descritivos (ex: `create`, `show`, `update`)
- **Arquivos**: `[entity].controller.ts` (ex: `role.controller.ts`)
- **Pastas**: Nome do domínio em minúsculo (ex: `role`, `permission`)

## Dependências

- **Services**: Para lógica de negócio
- **Resources**: Para formatação de resposta
- **Validations**: Para schemas de entrada
- **Utils**: Para `catchAsync` e outras utilidades
- **Constants**: Para códigos de status HTTP 