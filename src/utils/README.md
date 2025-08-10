# Utils

Este diretório contém utilitários essenciais utilizados em toda a aplicação para fornecer funcionalidades comuns e reutilizáveis.

## Estrutura

```
utils/
├── app-error.utils.ts     # Classes para tratamento padronizado de erros
├── catch-async.utils.ts   # Funções para tratamento assíncrono
├── logger.utils.ts        # Sistema de logs da aplicação
└── openapi.utils.ts       # Geração de documentação OpenAPI
```

## Descrição

### app-error.utils.ts

Fornece classes para padronização de erros na aplicação:

- **AppError**: Classe base para todos os erros da aplicação
- **BadRequestError**: Erro para requisições inválidas (status 400)
- **UnauthorizedError**: Erro para operações não autorizadas (status 401)
- **ForbiddenError**: Erro para acesso negado (status 403)
- **NotFoundError**: Erro para recursos não encontrados (status 404)
- **ValidationError**: Erro para falhas de validação (status 400)
- **ConflictError**: Erro para conflitos de recurso (status 409)

### catch-async.utils.ts

Contém o utilitário `catchAsync` que simplifica o tratamento de erros em funções assíncronas do Express, permitindo o uso de async/await sem a necessidade de blocos try/catch.

### logger.utils.ts

Implementa um sistema completo de logs com:

- Registro em arquivos e console
- Organização de logs por data
- Logs separados para erros e informações gerais
- Métodos para diferentes níveis de log: info, error, warn e debug
- Funções específicas para exibir informações sobre inicialização do servidor

### openapi.utils.ts

Responsável por gerar a documentação OpenAPI (Swagger) para a API:

- Define esquemas para endpoints da API
- Gera documentação completa em formato JSON
- Mapeia rotas, parâmetros e respostas
- Implementa a documentação de segurança com JWT

## Uso

Exemplos de uso dos utilitários:

```typescript
// Tratamento de erros
import { NotFoundError } from '@/utils/app-error.utils';
throw new NotFoundError('Usuário não encontrado');

// Tratamento assíncrono
import { catchAsync } from '@/utils/catch-async.utils';
router.get('/users', catchAsync(async (req, res) => {
  // código assíncrono sem try/catch
}));

// Logs
import { logger } from '@/utils/logger.utils';
logger.info('Operação realizada com sucesso');
logger.error('Erro ao processar requisição', error);

// OpenAPI
import { generateOpenAPIDocument } from '@/utils/openapi.utils';
generateOpenAPIDocument(); // Gera documentação OpenAPI
``` 