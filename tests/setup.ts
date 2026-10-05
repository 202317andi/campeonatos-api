import { beforeAll, afterEach, afterAll } from "vitest";
import mongoose from "mongoose";

// variáveis que a API precisa (no lugar do .env)
process.env.JWT_SECRET = "segredo_de_teste";
process.env.JWT_EXPIRES_IN = "1h";

// antes de TODOS os testes: conecta no banco de teste
beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27018/campeonatos_test");
});

// depois de CADA teste: apaga os dados
afterEach(async () => {
  const colecoes = await mongoose.connection.db!.collections();
  for (const colecao of colecoes) {
    await colecao.deleteMany({});
  }
});

// depois de TODOS os testes: desconecta
afterAll(async () => {
  await mongoose.disconnect();
});