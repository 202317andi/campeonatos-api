import mongoose from "mongoose"; // ponte com o MongoDB

// função que conecta no banco
export async function conectarBanco(): Promise<void> {
  const uri = process.env.MONGO_URI; // lê o endereço do .env

  // se esqueceu de configurar o .env, avisa e para
  if (!uri) {
    throw new Error("MONGO_URI não definida no .env");
  }

  await mongoose.connect(uri); // espera conectar
  console.log("MongoDB conectado!");
}