// formato de uma resposta de erro, reaproveitado em várias rotas
const respostaErro = {
  description: "Erro",
  content: {
    "application/json": { schema: { $ref: "#/components/schemas/Erro" } },
  },
};

// parâmetro "id" que vem na URL
const parametroId = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "string" },
  description: "ID do campeonato",
};

// marca a rota como protegida (mostra o cadeado)
const protegida = [{ bearerAuth: [] }];

export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API de Campeonatos",
    version: "1.0.0",
    description: "Gerenciamento de campeonatos de futebol amador",
  },
  servers: [{ url: "http://localhost:3000" }],

  // ===== MOLDES (formatos dos dados) =====
  components: {
    // tipo de autenticação: token JWT no cabeçalho
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      RegistroInput: {
        type: "object",
        required: ["nome", "email", "senha"],
        properties: {
          nome: { type: "string", example: "Anderson" },
          email: { type: "string", example: "anderson@teste.com" },
          senha: { type: "string", minLength: 6, example: "123456" },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "senha"],
        properties: {
          email: { type: "string", example: "anderson@teste.com" },
          senha: { type: "string", example: "123456" },
        },
      },
      Usuario: {
        type: "object",
        properties: {
          id: { type: "string", example: "6ac14082c34958bac2895bd9" },
          nome: { type: "string", example: "Anderson" },
          email: { type: "string", example: "anderson@teste.com" },
        },
      },
      LoginResposta: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
          usuario: { $ref: "#/components/schemas/Usuario" },
        },
      },
      Jogador: {
        type: "object",
        required: ["nome", "numeroCamisa", "posicao"],
        properties: {
          nome: { type: "string", example: "Anderson" },
          numeroCamisa: { type: "integer", minimum: 1, maximum: 99, example: 10 },
          posicao: {
            type: "string",
            enum: ["goleiro", "defensor", "meio-campo", "atacante"],
          },
          fotoUrl: { type: "string", example: "https://exemplo.com/foto.jpg" },
        },
      },
      Time: {
        type: "object",
        required: ["nome"],
        properties: {
          nome: { type: "string", example: "Grêmio da Vila" },
          jogadores: {
            type: "array",
            items: { $ref: "#/components/schemas/Jogador" },
          },
        },
      },
      CampeonatoInput: {
        type: "object",
        required: ["nome", "modalidade", "cidade", "dataInicio", "prazoInscricao", "maxTimes"],
        properties: {
          nome: { type: "string", example: "Copa Tapejara de Futsal" },
          modalidade: { type: "string", enum: ["campo", "futsal", "society"] },
          cidade: { type: "string", example: "Tapejara" },
          dataInicio: { type: "string", format: "date", example: "2026-11-01" },
          prazoInscricao: { type: "string", format: "date", example: "2026-10-20" },
          maxTimes: { type: "integer", minimum: 4, maximum: 32, example: 8 },
          status: {
            type: "string",
            enum: ["inscricoes abertas", "em andamento", "finalizado"],
          },
        },
      },
      Campeonato: {
        allOf: [
          { $ref: "#/components/schemas/CampeonatoInput" },
          {
            type: "object",
            properties: {
              _id: { type: "string", example: "6ac1333014df64fd487e1bec" },
              times: { type: "array", items: { $ref: "#/components/schemas/Time" } },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        ],
      },
      Erro: {
        type: "object",
        properties: {
          erro: { type: "string", example: "Campeonato não encontrado" },
        },
      },
    },
  },

  // ===== ROTAS =====
  paths: {
    // ----- AUTENTICAÇÃO -----
    "/auth/registrar": {
      post: {
        tags: ["Autenticação"],
        summary: "Cadastra um usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RegistroInput" } },
          },
        },
        responses: {
          201: {
            description: "Usuário criado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Usuario" } },
            },
          },
          400: respostaErro,
          409: respostaErro,
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Autenticação"],
        summary: "Faz login e devolve o token",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/LoginInput" } },
          },
        },
        responses: {
          200: {
            description: "Login realizado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/LoginResposta" } },
            },
          },
          400: respostaErro,
          401: respostaErro,
        },
      },
    },

    // ----- CAMPEONATOS -----
    "/campeonatos": {
      get: {
        tags: ["Campeonatos"],
        summary: "Lista todos os campeonatos",
        responses: {
          200: {
            description: "Lista de campeonatos",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Campeonato" } },
              },
            },
          },
        },
      },
      post: {
        tags: ["Campeonatos"],
        summary: "Cria um campeonato",
        security: protegida,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CampeonatoInput" } },
          },
        },
        responses: {
          201: {
            description: "Campeonato criado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Campeonato" } },
            },
          },
          400: respostaErro,
          401: respostaErro,
        },
      },
    },
    "/campeonatos/{id}": {
      get: {
        tags: ["Campeonatos"],
        summary: "Busca um campeonato pelo ID",
        parameters: [parametroId],
        responses: {
          200: {
            description: "Campeonato encontrado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Campeonato" } },
            },
          },
          400: respostaErro,
          404: respostaErro,
        },
      },
      put: {
        tags: ["Campeonatos"],
        summary: "Atualiza um campeonato",
        security: protegida,
        parameters: [parametroId],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CampeonatoInput" } },
          },
        },
        responses: {
          200: {
            description: "Campeonato atualizado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Campeonato" } },
            },
          },
          400: respostaErro,
          401: respostaErro,
          404: respostaErro,
        },
      },
      delete: {
        tags: ["Campeonatos"],
        summary: "Exclui um campeonato",
        security: protegida,
        parameters: [parametroId],
        responses: {
          204: { description: "Campeonato excluído" },
          400: respostaErro,
          401: respostaErro,
          404: respostaErro,
        },
      },
    },
    "/campeonatos/{id}/times": {
      post: {
        tags: ["Campeonatos"],
        summary: "Inscreve um time no campeonato",
        security: protegida,
        parameters: [parametroId],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Time" } },
          },
        },
        responses: {
          201: {
            description: "Time inscrito",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Campeonato" } },
            },
          },
          400: respostaErro,
          401: respostaErro,
          404: respostaErro,
          409: respostaErro,
        },
      },
    },
  },
};