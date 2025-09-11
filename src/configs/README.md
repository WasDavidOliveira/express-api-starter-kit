# Configurações da API

Esta pasta contém arquivos de configuração para diferentes aspectos da API, permitindo gerenciar facilmente as configurações do aplicativo com base no ambiente de execução (desenvolvimento ou produção).

## Estrutura da Pasta

```
configs/
├── app.config.ts          # Configurações gerais da aplicação
├── cors.config.ts         # Configurações de CORS (Cross-Origin Resource Sharing)
├── docs.config.ts         # Configurações para documentação da API
├── helmet.config.ts       # Configurações de segurança via Helmet
└── environments/          # Configurações específicas por ambiente
    ├── cors/              # Configurações de CORS por ambiente
    │   ├── cors.development.ts
    │   └── cors.production.ts
    └── helmet/            # Configurações de Helmet por ambiente
        ├── helmet.development.ts
        └── helmet.production.ts
```

## Descrição dos Arquivos

### app.config.ts

Define as configurações principais da aplicação, incluindo:

- Porta do servidor
- Ambiente de execução (development/production)
- Origens permitidas para CORS
- Configurações de banco de dados
- Configurações JWT (segurança)

### cors.config.ts

Gerencia as configurações de CORS (Cross-Origin Resource Sharing), importante para definir quais origens podem acessar a API. Carrega automaticamente a configuração apropriada com base no ambiente.

### helmet.config.ts

Configura o middleware Helmet, que ajuda a proteger a aplicação definindo vários cabeçalhos HTTP relacionados à segurança. Seleciona automaticamente a configuração apropriada com base no ambiente.

### docs.config.ts

Gerencia as configurações para a documentação da API, incluindo:

- Carregamento da especificação OpenAPI
- Configurações de temas e clientes HTTP para a documentação

## Uso

As configurações são importadas nos respectivos módulos da aplicação conforme necessário. O sistema automaticamente carrega as configurações apropriadas com base na variável de ambiente `NODE_ENV`.
