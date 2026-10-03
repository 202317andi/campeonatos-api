import { Schema, model } from "mongoose";

// ===== TIPOS (para o TypeScript) =====

// cada jogador agora é um "mini cadastro"
export interface IJogador {
  nome: string;
  numeroCamisa: number;
  posicao: "goleiro" | "defensor" | "meio-campo" | "atacante";
  fotoUrl?: string; // o "?" quer dizer opcional
}
export interface ITime {
  nome: string;
  jogadores: IJogador[]; // lista de jogadores (antes era lista de textos)
}

// formato completo de um campeonato
export interface ICampeonato {
  nome: string;
  modalidade: "campo" | "futsal" | "society"; // só aceita esses 3
  cidade: string;
  dataInicio: Date;
  prazoInscricao: Date;
  maxTimes: number;
  status: "inscricoes abertas" | "em andamento" | "finalizado";
  times: ITime[]; // lista de times
}

// ===== SCHEMA (regras para o MongoDB) =====

// molde do jogador
const jogadorSchema = new Schema<IJogador>({
  nome: { type: String, required: true, trim: true },
  numeroCamisa: { type: Number, required: true, min: 1, max: 99 },
  posicao: {
    type: String,
    required: true,
    enum: ["goleiro", "defensor", "meio-campo", "atacante"],
  },
  fotoUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\//, "fotoUrl deve começar com http:// ou https://"],
  },
});

// molde do time
const timeSchema = new Schema<ITime>({
  nome: { type: String, required: true, trim: true },
  jogadores: { type: [jogadorSchema], default: [] },
});

// molde do campeonato
const campeonatoSchema = new Schema<ICampeonato>(
  {
    nome: { type: String, required: true, trim: true },
    modalidade: {
      type: String,
      required: true,
      enum: ["campo", "futsal", "society"], // valores permitidos
    },
    cidade: { type: String, required: true, trim: true },
    dataInicio: { type: Date, required: true },
    prazoInscricao: { type: Date, required: true },
    maxTimes: { type: Number, required: true, min: 4, max: 32 },
    status: {
      type: String,
      enum: ["inscricoes abertas", "em andamento", "finalizado"],
      default: "inscricoes abertas", // novo campeonato já abre inscrições
    },
    times: { type: [timeSchema], default: [] },
  },
  { timestamps: true } // cria createdAt e updatedAt sozinho
);

// cria o model: é por ele que vamos salvar e buscar no banco
export const Campeonato = model<ICampeonato>("Campeonato", campeonatoSchema);