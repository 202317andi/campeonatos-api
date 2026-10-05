 import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";

// ===== AJUDANTES =====

// gera uma data a partir de hoje (ex.: dias(10) = daqui a 10 dias)
function dias(quantidade: number): string {
  const data = new Date();
  data.setDate(data.getDate() + quantidade);
  return data.toISOString();
}

// campeonato válido de exemplo
const campeonatoValido = {
  nome: "Copa Tapejara de Futsal",
  modalidade: "futsal",
  cidade: "Tapejara",
  dataInicio: dias(30),     // começa daqui a 30 dias
  prazoInscricao: dias(10), // inscrições até daqui a 10 dias
  maxTimes: 8,
};

// time válido de exemplo
const timeValido = {
  nome: "Grêmio da Vila",
  jogadores: [
    { nome: "Anderson", numeroCamisa: 10, posicao: "meio-campo" },
    { nome: "João", numeroCamisa: 1, posicao: "goleiro" },
  ],
};

// cadastra, faz login e devolve o token (a "pulseira")
async function obterToken(): Promise<string> {
  const usuario = { nome: "Anderson", email: "anderson@teste.com", senha: "123456" };
  await request(app).post("/auth/registrar").send(usuario);
  const resposta = await request(app)
    .post("/auth/login")
    .send({ email: usuario.email, senha: usuario.senha });
  return resposta.body.token;
}

// cria um campeonato com token e devolve a resposta
async function criarCampeonato(token: string, dados: object = campeonatoValido) {
  return request(app)
    .post("/campeonatos")
    .set("Authorization", `Bearer ${token}`) // mostra a pulseira
    .send(dados);
}

describe("Campeonatos", () => {
  // ===== SUCESSO =====

  it("deve criar um campeonato", async () => {
    const token = await obterToken();
    const resposta = await criarCampeonato(token);

    expect(resposta.status).toBe(201);
    expect(resposta.body._id).toBeDefined();
    expect(resposta.body.status).toBe("inscricoes abertas");
  });

  it("deve listar os campeonatos", async () => {
    const token = await obterToken();
    await criarCampeonato(token);

    const resposta = await request(app).get("/campeonatos");

    expect(resposta.status).toBe(200);
    expect(resposta.body.length).toBe(1);
  });

  it("deve buscar um campeonato pelo id", async () => {
    const token = await obterToken();
    const criado = await criarCampeonato(token);

    const resposta = await request(app).get(`/campeonatos/${criado.body._id}`);

    expect(resposta.status).toBe(200);
    expect(resposta.body.nome).toBe(campeonatoValido.nome);
  });

  it("deve atualizar um campeonato", async () => {
    const token = await obterToken();
    const criado = await criarCampeonato(token);

    const resposta = await request(app)
      .put(`/campeonatos/${criado.body._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ cidade: "Passo Fundo" });

    expect(resposta.status).toBe(200);
    expect(resposta.body.cidade).toBe("Passo Fundo");
  });

  it("deve excluir um campeonato", async () => {
    const token = await obterToken();
    const criado = await criarCampeonato(token);

    const resposta = await request(app)
      .delete(`/campeonatos/${criado.body._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(resposta.status).toBe(204);

    // depois de excluir, não pode mais achar
    const busca = await request(app).get(`/campeonatos/${criado.body._id}`);
    expect(busca.status).toBe(404);
  });

  it("deve inscrever um time", async () => {
    const token = await obterToken();
    const criado = await criarCampeonato(token);

    const resposta = await request(app)
      .post(`/campeonatos/${criado.body._id}/times`)
      .set("Authorization", `Bearer ${token}`)
      .send(timeValido);

    expect(resposta.status).toBe(201);
    expect(resposta.body.times.length).toBe(1);
  });

  // ===== ERRO =====

  it("não deve criar sem token", async () => {
    const resposta = await request(app).post("/campeonatos").send(campeonatoValido);
    expect(resposta.status).toBe(401);
  });

  it("não deve criar com modalidade inválida", async () => {
    const token = await obterToken();
    const resposta = await criarCampeonato(token, { ...campeonatoValido, modalidade: "basquete" });
    expect(resposta.status).toBe(400);
  });

  it("não deve criar com prazo depois do início", async () => {
    const token = await obterToken();
    const resposta = await criarCampeonato(token, {
      ...campeonatoValido,
      prazoInscricao: dias(40), // depois do início (30 dias)
    });
    expect(resposta.status).toBe(400);
  });

  it("deve dar 400 com id inválido", async () => {
    const resposta = await request(app).get("/campeonatos/123");
    expect(resposta.status).toBe(400);
  });

  it("deve dar 404 com campeonato inexistente", async () => {
    const resposta = await request(app).get("/campeonatos/000000000000000000000000");
    expect(resposta.status).toBe(404);
  });

  it("não deve inscrever time com nome repetido", async () => {
    const token = await obterToken();
    const criado = await criarCampeonato(token);
    const url = `/campeonatos/${criado.body._id}/times`;

    await request(app).post(url).set("Authorization", `Bearer ${token}`).send(timeValido);
    const resposta = await request(app)
      .post(url)
      .set("Authorization", `Bearer ${token}`)
      .send(timeValido);

    expect(resposta.status).toBe(409);
  });

  it("não deve inscrever time depois do prazo", async () => {
    const token = await obterToken();
    const criado = await criarCampeonato(token, {
      ...campeonatoValido,
      prazoInscricao: dias(-1), // prazo foi ontem
    });

    const resposta = await request(app)
      .post(`/campeonatos/${criado.body._id}/times`)
      .set("Authorization", `Bearer ${token}`)
      .send(timeValido);

    expect(resposta.status).toBe(400);
  });

  it("não deve inscrever time com camisa repetida", async () => {
    const token = await obterToken();
    const criado = await criarCampeonato(token);

    const resposta = await request(app)
      .post(`/campeonatos/${criado.body._id}/times`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Juventude FC",
        jogadores: [
          { nome: "Lucas", numeroCamisa: 7, posicao: "atacante" },
          { nome: "Pedro", numeroCamisa: 7, posicao: "defensor" }, // camisa 7 repetida
        ],
      });

    expect(resposta.status).toBe(400);
  });
});