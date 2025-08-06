<h1 align="center">
    <img alt="Capa do Projeto FormBoost" title="FormBoost" src=".github/capa.png" />
</h1>

## 🤝 App-FormBoost

Bem-vindo ao projeto da FormBoost! Este repositório contém o código-fonte de uma Aplicação Fullstack, projetada para gerenciar Formulários inteligentes.


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


## 🚀 Getting started

- [**Docker**](https://docs.docker.com/engine/install/) **Docker Compose**

1. Clone the project and access the folder

   ```zsh
   $ git clone https://github.com/abraaodev/formboost.git && cd formboost
   ```

2. Create .env

   ```env
   DB_USER=formuser
   DB_PASSWORD=formpass
   DB_NAME=formboost_db
   DB_HOST=db
   DB_PORT=5432
   API_PORT=3333
   FRONTEND_PORT=3000
   ```

3. **Execute aplication**

   Unic command for build image API and Database

   ```zsh
   docker-compose up --build
   ```

   ```zsh
   docker-compose up
   ```

- **A) Stop Aplication:**

  ```zsh
  docker compose down
  ```

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

---

<p align="center">Made with ❤️ by Abraão DEV</p>
