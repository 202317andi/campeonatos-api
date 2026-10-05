import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";

// usuário de exemplo, usado em vários testes
const usuario = {
  nome: "Anderson",
  email: "anderson@teste.com",
  senha: "123456",
};

describe("Autenticação", () => {
  // ===== SUCESSO =====

  it("deve cadastrar um usuário", async () => {
    const resposta = await request(app).post("/auth/registrar").send(usuario);

    expect(resposta.status).toBe(201);
    expect(resposta.body.email).toBe(usuario.email);
    expect(resposta.body.senha).toBeUndefined(); // a senha NÃO pode voltar
  });

  it("deve fazer login e devolver o token", async () => {
    await request(app).post("/auth/registrar").send(usuario); // cadastra antes

    const resposta = await request(app)
      .post("/auth/login")
      .send({ email: usuario.email, senha: usuario.senha });

    expect(resposta.status).toBe(200);
    expect(resposta.body.token).toBeDefined(); // tem que vir o token
  });

  // ===== ERRO =====

  it("não deve cadastrar e-mail repetido", async () => {
    await request(app).post("/auth/registrar").send(usuario);
    const resposta = await request(app).post("/auth/registrar").send(usuario);

    expect(resposta.status).toBe(409);
  });

  it("não deve cadastrar com senha curta", async () => {
    const resposta = await request(app)
      .post("/auth/registrar")
      .send({ ...usuario, senha: "123" });

    expect(resposta.status).toBe(400);
  });

  it("não deve fazer login com senha errada", async () => {
    await request(app).post("/auth/registrar").send(usuario);

    const resposta = await request(app)
      .post("/auth/login")
      .send({ email: usuario.email, senha: "senhaerrada" });

    expect(resposta.status).toBe(401);
  });
});