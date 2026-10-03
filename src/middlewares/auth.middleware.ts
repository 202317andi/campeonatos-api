import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./error.middleware";

export function autenticar(req: Request, res: Response, next: NextFunction) {
  // o token vem no cabeçalho assim: "Authorization: Bearer <token>"
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("Token não informado", 401);
  }

  const token = header.split(" ")[1]; // separa "Bearer" do token

  const segredo = process.env.JWT_SECRET;
  if (!segredo) {
    throw new AppError("JWT_SECRET não configurado", 500);
  }

  try {
    jwt.verify(token, segredo); // confere a assinatura e a validade
    next();                     // pulseira ok → pode passar
  } catch {
    throw new AppError("Token inválido ou expirado", 401);
  }
}