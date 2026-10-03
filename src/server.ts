import "dotenv/config"; // carrega o .env (1ª linha)
import { app } from "./app";
import { conectarBanco } from "./config/database";

const PORT = Number(process.env.PORT) || 3000;

async function iniciar() {
  await conectarBanco();
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

iniciar().catch((erro) => {
  console.error("Erro ao iniciar:", erro);
  process.exit(1);
});