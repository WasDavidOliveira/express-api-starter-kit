# Configuração do Banco de Dados

Esta pasta contém a configuração, esquemas e migrações do banco de dados PostgreSQL utilizando o ORM Drizzle.

## Estrutura da Pasta

```
db/
├── db.connection.ts      # Configuração da conexão com o banco de dados
├── .gitignore            # Configuração para ignorar arquivos no Git
├── schema/               # Definições dos esquemas das tabelas
│   └── v1/               # Esquemas da versão 1
│       └── user.schema.ts # Esquema da tabela de usuários
└── migrations/           # Migrações geradas pelo Drizzle Kit
    ├── 0000_jazzy_tag.sql # Migração inicial
    └── meta/              # Metadados das migrações
```

## Conexão com o Banco de Dados

O arquivo `db.connection.ts` configura a conexão com o PostgreSQL utilizando o módulo `pg` e exporta uma instância do Drizzle ORM, que é utilizada em toda a aplicação para interagir com o banco de dados.

## Esquemas

Os esquemas definem a estrutura das tabelas no banco de dados e são organizados por versão (v1, v2, etc.). Cada esquema utiliza o Drizzle ORM para definir:

- Tabelas e seus nomes
- Colunas e seus tipos
- Restrições (chaves primárias, unicidade, etc.)
- Relacionamentos entre tabelas

### Exemplo de Esquema (user.schema.ts)

```typescript
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
```

## Migrações

As migrações são arquivos SQL gerados automaticamente pelo Drizzle Kit que representam as alterações no esquema do banco de dados. Elas são utilizadas para:

1. Criar e atualizar a estrutura do banco de dados
2. Versionar as alterações no esquema
3. Facilitar a implantação em diferentes ambientes

## Comandos do Drizzle

O projeto inclui diversos comandos npm para gerenciar o banco de dados:

- `db:generate`: Gera arquivos de migração baseados nas alterações dos esquemas
- `db:migrate`: Executa as migrações pendentes no banco de dados
- `db:studio`: Inicia o Drizzle Studio, uma interface web para visualizar e editar dados
- `db:push`: Aplica as alterações de esquema diretamente no banco de dados

## Configurações

A configuração da conexão com o banco de dados é obtida a partir do arquivo `app.config.ts`, que por sua vez lê variáveis de ambiente:

- `DB_HOST`: Host do banco de dados (padrão: "localhost")
- `DB_PORT`: Porta do banco de dados (padrão: "5432")
- `DB_USER`: Usuário do banco de dados (padrão: "postgres")
- `DB_PASSWORD`: Senha do banco de dados (padrão: "senha")
- `DB_NAME`: Nome do banco de dados (padrão: "carajapp")
