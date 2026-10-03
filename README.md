# API de Campeonatos de Futebol Amador

API para organizar campeonatos de futebol amador. O organizador cadastra campeonatos, e os times se inscrevem com seus jogadores até o prazo de inscrição.

## Recurso principal (CRUD)

**Campeonato**, com os campos:

- `nome`, `cidade`
- `modalidade`: `campo`, `futsal` ou `society`
- `dataInicio` e `prazoInscricao`
- `maxTimes`: de 4 a 32
- `status`: `inscricoes abertas`, `em andamento` ou `finalizado`
- `times`: lista de times, cada um com seus jogadores (nome, número da camisa, posição e foto)

**Regras de negócio:**

- O prazo de inscrição deve ser antes da data de início
- Depois do prazo, não é possível inscrever times
- O campeonato não aceita mais times que o limite (`maxTimes`)
- Não pode haver dois times com o mesmo nome no campeonato
- Não pode haver número de camisa repetido no mesmo time

## Tecnologias

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Docker (MongoDB)
- JWT (jsonwebtoken) + bcryptjs (login)
- Swagger (swagger-ui-express)
- Jest ou Vitest (testes)

## Como executar

**Pré-requisitos:** Node.js 20+ e Docker.

1. Instale as dependências:

```bash
   npm install
```

2. Crie o arquivo `.env` a partir do exemplo:

```bash
   cp .env.example .env
```

3. Suba o MongoDB no Docker:

```bash
   docker compose up -d
```

4. Inicie a API:

```bash
   npm run dev
```

A API roda em `http://localhost:3000`.

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `PORT` | Porta da API | `3000` |
| `MONGO_URI` | Endereço do MongoDB | `mongodb://localhost:27018/campeonatos` |
| `JWT_SECRET` | Chave para assinar o token | `uma_chave_secreta` |
| `JWT_EXPIRES_IN` | Validade do token | `1h` |

O MongoDB usa a porta **27018** no computador, para não conflitar com outro MongoDB na porta padrão (27017). Os dados ficam salvos no volume `mongo_data`.

## Documentação (Swagger)

Acesse: **http://localhost:3000/docs**

Para testar as rotas protegidas:

1. Cadastre um usuário em `POST /auth/registrar`
2. Faça login em `POST /auth/login` e copie o `token`
3. Clique em **Authorize** e cole o token

## Rotas

| Método | Rota | Descrição | Login? |
| --- | --- | --- | --- |
| POST | `/auth/registrar` | Cadastra usuário | Não |
| POST | `/auth/login` | Faz login e devolve o token | Não |
| GET | `/campeonatos` | Lista campeonatos | Não |
| GET | `/campeonatos/:id` | Busca um campeonato | Não |
| POST | `/campeonatos` | Cria campeonato | Sim |
| PUT | `/campeonatos/:id` | Atualiza campeonato | Sim |
| DELETE | `/campeonatos/:id` | Exclui campeonato | Sim |
| POST | `/campeonatos/:id/times` | Inscreve um time | Sim |

## Testes

```bash
npm test
```