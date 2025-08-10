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
├── index.ts                     # Exporta todos os controllers
├── base.controller.ts           # Classe base com métodos utilitários
└── [entity]/                    # Subpastas por domínio ou entidade
    └── [entity].controller.ts   # Implementação do controller específico
```

## Responsabilidades

Os controllers são responsáveis por:

- Extrair e validar dados de entrada (body, query, params)
- Delegar o processamento para os serviços
- Formatar respostas de sucesso
- Tratar erros e retornar códigos HTTP apropriados
- Implementar lógica de paginação e filtragem
- Controlar cabeçalhos de resposta e cookies
- Formatar recursos usando classes de recursos

## Exemplo de Implementação

```typescript
// user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/services/user/user.service';
import { UserResource } from '@/resources/user/user.resource';
import { PaginationParams } from '@/types/pagination.types';

export class UserController {
  constructor(
    private userService = new UserService(),
    private userResource = new UserResource()
  ) {}

  async listUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pagination: PaginationParams = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10
      };
      
      const filters = req.query.filter ? JSON.parse(String(req.query.filter)) : {};
      
      const result = await this.userService.findAll(pagination, filters);
      
      return res.json({
        data: this.userResource.transformCollection(result.data),
        meta: result.meta
      });
    } catch (error) {
      next(error);
    }
  }

  async getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      
      const user = await this.userService.findById(userId);
      
      return res.json(this.userResource.transform(user));
    } catch (error) {
      next(error);
    }
  }

  async createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      
      const user = await this.userService.create(userData);
      
      return res.status(201).json(this.userResource.transform(user));
    } catch (error) {
      next(error);
    }
  }

  async updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const userData = req.body;
      
      const user = await this.userService.update(userId, userData);
      
      return res.json(this.userResource.transform(user));
    } catch (error) {
      next(error);
    }
  }

  async deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      
      await this.userService.delete(userId);
      
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
```

## Boas Práticas

- Mantenha os controllers enxutos, delegando lógica complexa para serviços
- Use decoradores ou funções de utilidade para simplificar código repetitivo
- Implemente tratamento de erros consistente
- Utilize recursos para formatar respostas
- Implemente paginação, ordenação e filtragem de forma padronizada
- Siga convenções RESTful para códigos de status HTTP
- Documente endpoints com anotações para geração da documentação OpenAPI
- Retorne mensagens de erro claras e amigáveis
- Implemente validação de dados de entrada antes de processar a requisição 