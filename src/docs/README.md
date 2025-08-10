# Documentação da API

Esta pasta contém arquivos relacionados à documentação da API no formato OpenAPI (anteriormente conhecido como Swagger). A documentação é gerada automaticamente a partir dos schemas de validação Zod utilizados na aplicação.

## Estrutura da Pasta

```
docs/
├── index.ts         # Funções utilitárias para manipular a especificação OpenAPI
└── openapi.json     # Especificação OpenAPI no formato JSON
```

## Descrição dos Arquivos

### index.ts
Contém funções utilitárias para manipular a especificação OpenAPI:
- `updateOpenAPISpec`: Atualiza o arquivo openapi.json com uma nova especificação
- `readOpenAPISpec`: Lê o conteúdo atual do arquivo openapi.json

### openapi.json
Contém a especificação OpenAPI completa da API no formato JSON. Este arquivo:
- Define informações gerais sobre a API (título, descrição, versão)
- Lista todos os endpoints disponíveis, agrupados por tags
- Descreve os parâmetros de entrada e saída para cada endpoint
- Define os schemas de dados utilizados pela API
- Especifica os possíveis códigos de resposta e seus significados

## Geração da Documentação

A documentação é gerada automaticamente durante a inicialização do servidor através do utilitário `generateOpenAPIDocument` localizado em `src/utils/openapi.utils.ts`. Este utilitário:

1. Obtém os schemas Zod enriquecidos com metadados OpenAPI
2. Converte-os para o formato OpenAPI
3. Estrutura as informações de endpoints, métodos HTTP, parâmetros e respostas
4. Salva a especificação resultante em `openapi.json`

## Acesso à Documentação

A documentação da API pode ser acessada de duas formas:

1. **Interface Interativa**: Disponível em `/docs` - fornece uma interface amigável para explorar os endpoints, testar requisições e visualizar respostas
2. **Especificação Raw**: Disponível em `/openapi.json` - fornece o arquivo JSON bruto da especificação OpenAPI

A interface interativa é fornecida pela biblioteca Scalar (`@scalar/express-api-reference`), que é configurada em `src/middlewares/docs.middleware.ts`.

## Como Estender a Documentação

Para adicionar novos endpoints à documentação:

1. Defina os schemas Zod com metadados OpenAPI usando o método `.openapi()`
2. Atualize o utilitário `generateOpenAPIDocument` para incluir os novos endpoints e schemas
3. Reinicie o servidor para regenerar a documentação

Exemplo de schema Zod com metadados OpenAPI:

```typescript
import { z } from 'zod';

export const exemploSchema = z.object({
  nome: z.string().min(3).openapi({
    description: 'Nome do recurso',
    example: 'Exemplo de nome'
  }),
  idade: z.number().int().positive().openapi({
    description: 'Idade em anos',
    example: 25
  })
}).openapi({
  ref: 'ExemploInput',
  description: 'Dados para criação de exemplo'
});
```

## Benefícios da Documentação

- **Autoexplicativa**: Facilita o entendimento da API para novos desenvolvedores
- **Testável**: Permite testar os endpoints diretamente pela interface
- **Consistente**: Garante que a documentação esteja sempre atualizada com a implementação
- **Integrável**: Pode ser consumida por ferramentas de geração de código cliente 