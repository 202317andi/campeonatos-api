import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

// erro "personalizado": carrega a mensagem e o código HTTP
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// trata todos os erros da API num lugar só
export function errorMiddleware(
  erro: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // erros que o service apitou
  if (erro instanceof AppError) {
    res.status(erro.statusCode).json({ erro: erro.message });
    return;
  }

  // dados que não passaram nas regras do model (ex.: campo obrigatório)
  if (erro instanceof mongoose.Error.ValidationError) {
    const detalhes = Object.values(erro.errors).map((e) => e.message);
    res.status(400).json({ erro: "Dados inválidos", detalhes });
    return;
  }

  // tipo errado (ex.: texto onde devia ser número ou data)
  if (erro instanceof mongoose.Error.CastError) {
    res.status(400).json({ erro: `Valor inválido no campo ${erro.path}` });
    return;
  }

  // qualquer outro erro: mostra no terminal e responde 500
  console.error(erro);
  res.status(500).json({ erro: "Erro interno do servidor" });
}