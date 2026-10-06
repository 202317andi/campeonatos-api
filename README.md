# Campeonatos API

Uma API para organizar campeonatos de futebol amador, daqueles de bairro, de firma ou de futsal com a turma.

Quem organiza cadastra o campeonato. Os times se inscrevem com seus jogadores até o prazo que o organizador definiu. Depois disso, a inscrição fecha.

Fiz este projeto para a disciplina de Tópicos Especiais II. Esta é a primeira entrega (o backend), e o frontend vai usar esta mesma API.

## O que ela faz

O recurso principal é o **campeonato**. Dá para criar, listar, buscar, editar e excluir.

Dentro de cada campeonato ficam os **times**, e dentro de cada time ficam os **jogadores** (nome, número da camisa, posição e uma foto opcional).

Algumas regras que a API cuida sozinha:

- O prazo de inscrição tem que ser antes do início do campeonato.
- Passou do prazo, não entra mais time.
- Campeonato lotado não aceita mais times.
- Dois times do mesmo campeonato não podem ter o mesmo nome.
- Dois jogadores do mesmo time não podem ter a mesma camisa.

Qualquer pessoa pode **consultar** os campeonatos. Para **criar, editar, excluir ou inscrever um time**, é preciso estar logado.

## Feito com

Node.js, Express, TypeScript, MongoDB (com Mongoose), Docker, JWT para o login, Swagger para a documentação e Vitest para os testes.

## Como rodar

Você precisa do **Node.js 20 ou mais novo** e do **Docker** aberto.

```bash
# 1. instalar as dependências
npm install

# 2. criar o seu .env (depois abra e troque o JWT_SECRET)
cp .env.example .env

# 3. ligar o banco de dados
docker compose up -d

# 4. iniciar a API
npm run dev
```

Pronto, a API está em http://localhost:3000.

Para desligar o banco: `docker compose down`. Seus dados ficam guardados e voltam quando você ligar de novo.

## Variáveis de ambiente

Estão no arquivo `.env.example`:

| Variável | Para que serve | Exemplo |
| --- | --- | --- |
| `PORT` | Porta da API | `3000` |
| `MONGO_URI` | Endereço do banco | `mongodb://localhost:27018/campeonatos` |
| `JWT_SECRET` | Chave secreta do login | `coloque_uma_chave_secreta_aqui` |
| `JWT_EXPIRES_IN` | Quanto tempo o login vale | `1h` |

O banco usa a porta **27018** do seu computador. Escolhi essa para não esbarrar em outro MongoDB que já use a 27017.

## Testando pelo Swagger

Com a API rodando, abra **http://localhost:3000/docs**. Lá dá para ver todas as rotas e testar clicando.

Para usar as rotas com cadeado:

1. Em `POST /auth/registrar`, crie um usuário.
2. Em `POST /auth/login`, entre com ele e copie o `token` que voltar.
3. Clique no botão **Authorize**, cole só o token e confirme.

O login vale por 1 hora. Depois disso, é só entrar de novo.

## Rotas

| Método | Rota | O que faz | Precisa de login? |
| --- | --- | --- | --- |
| POST | `/auth/registrar` | Cria um usuário | Não |
| POST | `/auth/login` | Faz login e devolve o token | Não |
| GET | `/campeonatos` | Lista os campeonatos | Não |
| GET | `/campeonatos/:id` | Mostra um campeonato | Não |
| POST | `/campeonatos` | Cria um campeonato | Sim |
| PUT | `/campeonatos/:id` | Edita um campeonato | Sim |
| DELETE | `/campeonatos/:id` | Exclui um campeonato | Sim |
| POST | `/campeonatos/:id/times` | Inscreve um time com os jogadores | Sim |

## Exemplo: inscrever um time

Depois de logar, em `POST /campeonatos/:id/times`:

```json
{
  "nome": "Carga Pesada",
  "jogadores": [
    { "nome": "Chubasa", "numeroCamisa": 1, "posicao": "goleiro" },
    { "nome": "Leo Krek", "numeroCamisa": 6, "posicao": "defensor" },
    { "nome": "Pichain", "numeroCamisa": 9, "posicao": "atacante" }
  ]
}
```

As posições aceitas são `goleiro`, `defensor`, `meio-campo` e `atacante`. A `fotoUrl` é opcional.

## Testes

```bash
npm test
```

Os testes usam um banco só deles (`campeonatos_test`), então não mexem nos seus dados. Só lembre de deixar o Docker ligado.

Eles cobrem o cadastro e o login (incluindo senha errada e e-mail repetido) e todo o CRUD, com os casos de erro: sem login, dados inválidos, id inválido, campeonato que não existe, prazo vencido, time repetido e camisa repetida.

## Como o código está organizado

```
src/
├── routes/        as URLs da API
├── controllers/   recebem o pedido e respondem
├── services/      as regras de negócio
├── repositories/  conversam com o banco
├── models/        o formato dos dados
├── middlewares/   login e tratamento de erros
├── config/        conexão com o banco
└── docs/          documentação do Swagger
tests/             testes automatizados
```

Um pedido passa por essas camadas nessa ordem, e cada uma tem uma função só.