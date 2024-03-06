
# Futebol Clube(TFC)

Projeto realizado com o objetivo de informar sobre partidas e classificações de futebol!



![Logo](https://raw.githubusercontent.com/tryber/sd-025-a-trybe-futebol-clube/main/assets/front-example.png?token=GHSAT0AAAAAAB5ARU2O45HY4LOKVLJNH4N4ZCHG7CA)


## Sumário

 - [Sobre o projeto](#sobre-o-projeto)
 - [Tecnologias Utilizadas]()
 - [Instalação]()
 - [Habilidades]()


## Sobre o projeto

Este projeto é um site de futebol desenvolvido para informar sobre partidas de futebol. Ele permite acessar as partidas, registro de novos usuários, acompanhamento das partidas e gerenciamento dos resultados.

Todos os usuários têm acesso através do login com diferentes permissões. O aplicativo valida o tipo de usuário a que a conta pertence usando o Token JWT. Além disso, somente o admin pode alterar o resultado e estado das partidas.


## Tecnologias Utilizadas

- Node.js
- TypeScript
- JWT
- Sequelize
- POO
- S.O.L.I.D
- Arquitetura MSC
- docker
- docker-compose
- MySql
- Express
- Mocha
- Chai
- Sinon


## Instalação

Configurações para rodar o projeto:

- Sistema Operacional Distribuição Unix
- Node versão 16.14.0 LTS
- Docker
- Docker-compose versão >=1.29.2

    Com Docker:

```bash
  npm run compose:up na raiz do projeto;

  npm run install:apps na raiz do projeto para instalar dependências do front e back-end;

  docker exec -it app_backend bash em ./app/backend;

  npm run build no container do backend;

  npm run db:reset no container do backend;
```
    Localmente:
     Necessita ter um banco de dados(MySql) instalado localmente
 ```bash
 npm run install:apps na raiz do projeto para instalar dependências do front e back-end;

npm run compose:up na raiz do projeto;

npm run build;

npm run db:reset;
```

## Habilidades:
- A realização da dockerização dos apps, network, volume e compose;
- A modelagem de dados com MySQL através do Sequelize;
- A criação e associação de tabelas usando models do sequelize;
- A construção de uma API REST com endpoints para consumir os models criados;
- A construção de um CRUD com TypeScript, utilizando ORM;


## Contato

- E-mail: victor_cabral_o@hotmail.com
- LinkedIn: https://www.linkedin.com/in/victor-alejandro-orellana/

