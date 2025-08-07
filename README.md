<h1 align="center">
    <img alt="Capa do Projeto FormBoost" title="FormBoost" src=".github/capa.png" />
</h1>

## 🤝 App-FormBoost

Bem-vindo ao projeto da FormBoost! Este repositório contém o código-fonte de uma Aplicação Fullstack, projetada para gerenciar Formulários inteligentes.

## 📄 Documentação de Análise

- [Documento de Análise](./ANALISE.md)


## 🎯 Endpoints

### Auth

|        Endpoint         |               Router               |             Description             |
| :---------------------: | :--------------------------------: | :---------------------------------: |
|    **[`post`](#post)**    |         `/users`          |  Fazer cadastro de um novo User  |
|   **[`post`](#post)**   |          `/sessions`          |    Autenticação do User    |
|    **[`post`](#post)**    | `/logout` |    Logout do User    |
|    **[`get`](#get)**    | `/profile` | Recuperar dados do User autenticado |

### Forms

|        Endpoint         |               Router               |             Description             |
| :---------------------: | :--------------------------------: | :---------------------------------: |
|    **[`get`](#get)**    |         `/forms`          |  Buscar todos os formulários   |
|   **[`post`](#post)**   |          `/forms`          |    Criar um novo formulário    |
|    **[`get`](#get)**    | `/forms/{formId}` |    Buscar formulário por ID    |
|    **[`put`](#put)**    | `/forms/{formId}/schema_version` | Atualizar formulário existente |
| **[`delete`](#delete)** | `/forms/{formId}` |   Deletar formulário por ID    |

### Submit

|        Endpoint         |                        Router                        |                 Description                 |
| :---------------------: | :--------------------------------------------------: | :-----------------------------------------: |
|    **[`get`](#get)**    |      `/forms/{formId}/submit`      | Buscar todas as submissões de um formulário |
|   **[`post`](#post)**   |      `/forms/{formId}/submit`      |    Submeter um formulário   |
| **[`delete`](#delete)** | `/forms/{formId}/submit/{submitId}` |             Deletar submissão por ID            |

## 📫 Testing with Postman

To make API testing easier, a Postman collection is included in this repository. You can import it with a single click using the button below.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/38248876/2sB3BDHqBv)

## Technologies


### Frontend

- [Nuxt](https://nuxt.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zod](https://tanstack.com/query/latest)
- [Shadcn-UI](https://ui.shadcn.com/)
- [Tailwind](https://tailwindcss.com/)

### Backend

- [Fastify](https://fastify.dev/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://gorm.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Fastify-type-provider-Zod](https://github.com/turkerdev/fastify-type-provider-zod)
- [Vitest](https://vitest.dev/)
- [Redis](https://redis.io/)
- [Scalar](https://scalar.com/)


## Protótipo UI [FIGMA]
- [Ver protótipo](https://www.figma.com/design/WDONtIkDx456NRIM6pG6Q9/FormBoost?node-id=0-1&t=USYiTsA6e7cgnX94-1)




## 🚀 Getting started

- [**Docker**](https://docs.docker.com/engine/install/) **Docker Compose**

1. Clone the project and access the folder

   ```zsh
   $ git clone https://github.com/abraaodev/form-boost.git && cd form-boost
   ```

2. Create .env

   ```env
   DB_USER=docker
   DB_PASSWORD=docker
   DB_NAME=form-boost
   DB_PORT=5432

   # Redis
   REDIS_PORT=6379

   # Api
   API_PORT=3333

   # Front
   WEB_PORT=3000

   # Security
   JWT_SECRET=dev-secret-key 
   ```

3. **Execute application**

   Build and start all services (API, Database, Redis, Frontend):

   ```zsh
   docker-compose up --build
   ```

   Or start without rebuilding:

   ```zsh
   docker-compose up
   ```

4. **Populate database with sample data (Optional)**

   After the containers are running, you can populate the database with sample data:

   ```zsh
   # Apply database migrations
   docker exec form-boost-api pnpm db:migrate

   # Run database seeds
   docker exec form-boost-api pnpm db:seed
   ```

   **Default credentials created:**
   - Email: `solusenai@fiepe.org.br`
   - Password: `123456`

4.2. **Run Tests (Optional)**

   After the containers are running, you can execute the API tests:

   ```zsh
   # Run tests with visual interface (Vitest UI)
   docker exec form-boost-api pnpm test:ui

   # Run tests in watch mode
   docker exec form-boost-api pnpm test:watch

   # Run tests once
   docker exec form-boost-api pnpm test
   ```

   **Note:** Tests use Vitest as the testing framework and include unit tests.

5. **Access the application**

   - **Frontend**: http://localhost:3000
   - **API Documentation**: http://localhost:3333/docs/
   - **API Base URL**: http://localhost:3333/api/v1

- **Stop Application:**

  ```zsh
  docker compose down
  ```

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

---

<p align="center">Made with ❤️ by Abraão DEV</p>
