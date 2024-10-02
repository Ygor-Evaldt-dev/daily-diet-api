# Daily Diet API
![Versão](https://img.shields.io/badge/Versão-1.0.0-blue?style=flat-square)

Daily Diet API é uma aplicação back-end desenvolvida com Node.js e TypeScript. O objetivo deste projeto é fornecer um suporte robusto para aplicativos de controle de refeições diárias, ajudando as pessoas a manterem uma dieta saudável.

## Funcionalidades

### Usuário
- Criação 
- Busca única
- Atualização

### Refeição

- Criação
- Atualização
- Exclusão
- Listagem
- Busca única
- Sumário

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- InversifyJS (Injeção de Dependência)
- Jest e Supertest (Testes)

## Instalação

Para instalar e rodar o projeto localmente, siga os seguintes passos:

1. Clone o repositório
```bash
git clone https://github.com/Ygor-Evaldt-dev/daily-diet-api.git
```

2 - Navegue até o diretório do projeto

```bash
cd daily-diet-api
```

3 - Instale as dependências

```bash
npm install
```

4 - Configure as variáveis de ambiente em um arquivo .env baseado no arquivo .env.example.

5 - Rode as migrações do banco de dados

```sh
npm run knex -- migrate:latest
```

6 - Inicie o servidor

```sh
npm run dev
```

## Testes

Este projeto inclui testes de integração e E2E (End-to-End). Para executar os testes, utilize os seguintes comandos:

- Para rodar todos os testes
    ```sh
    npm run test
    ```

- Para rodar somente os testes de integração
    ```sh
    npm run test:integration
    ```

- Para rodar somente os testes E2E (End-to-End)
    ```sh
    npm run test:e2e
    ```

## Recursos

### Usuários
- Criação de novo usuário
    - `POST` /user

    ```json
    {
        "email": "valid_email@gmail.com",
        "password": "password@123"
    }
    ```

- Atualização de usuário cadastrado
    - `PUT` /user

    ```json
    {
        "email": "valid_email_updated@gmail.com",
        "password": "password@321"
    }
    ```

- Busca de usuário cadastrado
    - `GET` /user/:email

### Refeições (Precisa de autênticação) <br>
![Basic Auth](https://img.shields.io/badge/Basic%20Auth-Enabled-blue)

- Criação de uma nova refeição
    - `POST` /meal

    ```json
    {
        "name": "Almoço",
        "description": "Refeição rica em proteínas",
        "isOnDiet": true,
        "createdAt": "2024-09-30T15:29:28.995Z"
    }
    ```

- Atualização de uma refeição existente
    - `PUT` /meal/:id

    ```json
    {
        "name": "Jantar",
        "description": "Refeição leve",
        "isOnDiet": true,
        "createdAt": "2024-09-30T15:29:28.995Z"
    }
    ```

- Deletar uma refeição
    - `DELETE` /meal/:id

- Listar todas as refeições
    - `GET` /meal/:page/:take

- Sumário das refeições
    - `GET` /meal/summary

## Contribuição

Sinta-se à vontade para contribuir com este projeto. Para isso:

1 - Faça um fork do projeto

2 - Crie uma nova branch (git checkout -b feature/nova-feature)

3 - Commit suas mudanças (git commit -m 'Adiciona nova feature')

4 - Faça um push para a branch (git push origin feature/nova-feature)

5 - Abra um Pull Request

## Contato

Para qualquer dúvida ou sugestão de melhoria, por favor, entre em contato através do e-mail `evaldtygor@gmail.com`

## Licença
Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para mais detalhes.

Desenvolvido por Ygor Evaldt