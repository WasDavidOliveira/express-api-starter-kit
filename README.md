# 🚀 Express API Starter Kit

Um kit inicial completo para desenvolvimento de APIs RESTful com Node.js e TypeScript, oferecendo uma arquitetura robusta, documentação automática e ferramentas modernas.

---

## 📚 Tecnologias Incluídas

### 🔧 Core
- **Express 5.1.0**: Framework web rápido e minimalista para Node.js
- **TypeScript 5.8.3**: Superset tipado de JavaScript
- **Zod 3.24.3**: Validação de schemas com inferência de tipos
- **Zod-OpenAPI 4.2.4**: Integração de Zod com OpenAPI para documentação automática

### 💾 Banco de Dados
- **Drizzle ORM 0.42.0**: ORM TypeScript-first com excelente experiência de desenvolvimento
- **PostgreSQL**: Banco de dados relacional (via pg 8.14.1)
- **Drizzle Kit**: Ferramentas CLI para migrações e gerenciamento de esquema

### 🔒 Segurança
- **Bcrypt 5.1.1**: Hashing de senhas
- **Helmet 8.1.0**: Segurança para aplicações Express
- **Express Rate Limit 7.5.0**: Limitação de requisições
- **CORS**: Configuração de Cross-Origin Resource Sharing
- **JsonWebToken 9.0.2**: Implementação de JWT para autenticação

### 🛠️ Utilidades
- **Dotenv 16.5.0**: Gerenciamento de variáveis de ambiente
- **Winston 3.17.0**: Logger para Node.js

### 👨‍💻 Desenvolvimento
- **ESLint 9.25.0**: Linting de código
- **Prettier 3.5.3**: Formatação de código
- **Vitest 3.1.1**: Framework de testes rápido
- **ts-node-dev**: Reinicialização automática durante desenvolvimento

---

## 📂 Estrutura do Projeto

```
src/
├── 📁 config/           # Configurações da aplicação
├── 📁 controllers/      # Controladores que processam as requisições
├── 📁 db/               # Definições de schema e migrações do Drizzle
├── 📁 middlewares/      # Middlewares do Express
├── 📁 models/           # Definições de tipos e interfaces
├── 📁 routes/           # Definições de rotas da API
├── 📁 services/         # Lógica de negócios
├── 📁 utils/            # Funções utilitárias
├── 📁 validations/      # Schemas Zod para validação
└── 📄 server.ts         # Ponto de entrada da aplicação
```

---

## ⚙️ Instalação

```bash
# Clone o repositório
git clone https://github.com/WasDavidOliveira/express-api-starter-kit
cd express-api-starter-kit

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 📋 Scripts Disponíveis

- `npm run dev` - ▶️ Inicia o servidor em modo de desenvolvimento com hot-reload
- `npm run build` - 🏗️ Compila o código TypeScript para JavaScript
- `npm run start` - 🚀 Inicia o servidor em modo de produção (após o build)
- `npm run lint` - 🔍 Executa a verificação de linting com ESLint
- `npm run format` - ✨ Formata o código com Prettier
- `npm run db:generate` - 📝 Gera migrações com base nas alterações do schema
- `npm run db:migrate` - 📊 Executa as migrações pendentes
- `npm run db:studio` - 🔬 Inicia o Drizzle Studio para visualização e edição do banco
- `npm run db:push` - 📤 Sincroniza o banco de dados com o schema atual

---

## 📖 Documentação da API

A documentação da API é gerada automaticamente usando Zod-OpenAPI e pode ser acessada em:

```
http://localhost:3000/docs
```

## 🔐 Autenticação

O starter kit vem com autenticação JWT configurada. Para criar novos usuários e obter tokens de autenticação, utilize os endpoints:

- `POST /api/v1/auth/register` - 📝 Registrar um novo usuário
- `POST /api/v1/auth/login` - 🔑 Login para obter token JWT

---

## 🗃️ Uso do Banco de Dados

O projeto utiliza Drizzle ORM para interações com o banco de dados PostgreSQL. Para definir novos modelos:

1. ✏️ Crie ou modifique os schemas em `src/db/schema`
2. 🔄 Gere migrações com `npm run db:generate`
3. ⬆️ Aplique migrações com `npm run db:migrate`

---

## 🔌 Adicionando Novos Endpoints

1. 📝 Crie um schema de validação em `src/validations`
2. 🎮 Crie um controlador em `src/controllers`
3. 🛣️ Defina as rotas em `src/routes`
4. 🔗 Registre as rotas no arquivo principal de rotas

---

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, abra um issue ou envie um pull request.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.
