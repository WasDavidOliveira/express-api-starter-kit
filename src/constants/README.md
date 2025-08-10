# Constantes da API

Esta pasta contém definições de constantes utilizadas em toda a aplicação. O uso de constantes melhora a manutenibilidade do código, evita repetições e diminui a probabilidade de erros.

## Estrutura da Pasta

```
constants/
├── environment.constants.ts      # Constantes relacionadas aos ambientes de execução
└── status-code.constants.ts      # Constantes de códigos de status HTTP
```

## Descrição dos Arquivos

### environment.constants.ts
Define as constantes relacionadas aos ambientes de execução da aplicação:
- `PRODUCTION`: Ambiente de produção
- `DEVELOPMENT`: Ambiente de desenvolvimento
- `LOCAL`: Ambiente local

Essas constantes são utilizadas para determinar comportamentos específicos da aplicação com base no ambiente em que está sendo executada.

### status-code.constants.ts
Contém todos os códigos de status HTTP utilizados nas respostas da API, organizados por categorias:
- **Respostas de Sucesso (2xx)**: Códigos que indicam que a requisição foi processada com sucesso
- **Redirecionamentos (3xx)**: Códigos que indicam algum tipo de redirecionamento
- **Erros do Cliente (4xx)**: Códigos que indicam erros causados pelo cliente
- **Erros do Servidor (5xx)**: Códigos que indicam erros no servidor

Além disso, o arquivo inclui um tipo TypeScript (`StatusCodeType`) para facilitar o uso dessas constantes no código.

## Vantagens do Uso de Constantes

1. **Consistência**: Garante que os mesmos valores sejam utilizados em toda a aplicação
2. **Legibilidade**: Torna o código mais expressivo e fácil de entender
3. **Manutenção**: Facilita alterações futuras, pois os valores estão centralizados
4. **Prevenção de erros**: Reduz erros de digitação e uso incorreto de valores

## Uso

Para utilizar estas constantes em qualquer parte do projeto, basta importá-las:

```typescript
import { Environment } from '@/constants/environment.constants';
import { StatusCode } from '@/constants/status-code.constants';

// Exemplo de uso
if (process.env.NODE_ENV === Environment.PRODUCTION) {
  // lógica específica para produção
}

// Utilizando códigos de status HTTP
response.status(StatusCode.OK).json({ message: 'Operação realizada com sucesso' });
``` 