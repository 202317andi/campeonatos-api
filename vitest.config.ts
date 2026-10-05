import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",              // roda no Node (não no navegador)
    setupFiles: ["./tests/setup.ts"], // arquivo que prepara o banco
    fileParallelism: false,           // um arquivo de teste por vez (usam o mesmo banco)
  },
});