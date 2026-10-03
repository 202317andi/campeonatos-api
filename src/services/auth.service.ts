import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { UsuarioRepository } from "../repositories/usuario.repository";
import { IUsuario } from "../models/usuario.model";
import { AppError } from "../middlewares/error.middleware";

export class AuthService {
  private repository = new UsuarioRepository();

  // cadastro de usuário
  async registrar(dados: IUsuario) {
    // confere a senha ANTES de criptografar
    if (!dados.senha || dados.senha.length < 6) {
      throw new AppError("A senha deve ter pelo menos 6 caracteres", 400);
    }

    const existe = await this.repository.buscarPorEmail(dados.email ?? "");
    if (existe) {
      throw new AppError("E-mail já cadastrado", 409);
    }

    // embaralha a senha (10 = força da criptografia)
    const senhaCriptografada = await bcrypt.hash(dados.senha, 10);

    const usuario = await this.repository.criar({ ...dados, senha: senhaCriptografada });

    // devolve os dados SEM a senha
    return { id: usuario._id, nome: usuario.nome, email: usuario.email };
  }

  // login: confere e-mail e senha e devolve o token
  async login(email: string, senha: string) {
    if (!email || !senha) {
      throw new AppError("Informe e-mail e senha", 400);
    }

    const usuario = await this.repository.buscarPorEmailComSenha(email);
    if (!usuario) {
      throw new AppError("E-mail ou senha inválidos", 401);
    }

    // compara a senha digitada com a criptografada do banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      throw new AppError("E-mail ou senha inválidos", 401);
    }

    // cria a "pulseira" (token) com o id e o e-mail do usuário
    const token = jwt.sign(
      { id: usuario._id.toString(), email: usuario.email },
      this.obterSegredo(),
      { expiresIn: (process.env.JWT_EXPIRES_IN ?? "1h") as SignOptions["expiresIn"] }
    );

    return {
      token,
      usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email },
    };
  }

  // pega a chave secreta do .env
  private obterSegredo(): string {
    const segredo = process.env.JWT_SECRET;
    if (!segredo) {
      throw new AppError("JWT_SECRET não configurado no .env", 500);
    }
    return segredo;
  }
}