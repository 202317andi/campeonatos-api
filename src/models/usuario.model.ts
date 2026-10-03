import { Schema, model } from "mongoose";

// formato do usuário (para o TypeScript)
export interface IUsuario {
  nome: string;
  email: string;
  senha: string; // sempre criptografada no banco
}

// regras do usuário (para o MongoDB)
const usuarioSchema = new Schema<IUsuario>(
  {
    nome: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,      // não pode ter dois usuários com o mesmo e-mail
      lowercase: true,   // salva sempre em minúsculo
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "E-mail inválido"],
    },
    senha: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // não vem nas buscas, a não ser que a gente peça
    },
  },
  { timestamps: true }
);

export const Usuario = model<IUsuario>("Usuario", usuarioSchema);