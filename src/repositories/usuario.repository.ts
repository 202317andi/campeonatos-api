import { Usuario, IUsuario } from "../models/usuario.model";

export class UsuarioRepository {
  // salva um usuário novo
  async criar(dados: IUsuario) {
    return Usuario.create(dados);
  }

  // busca pelo e-mail (sem a senha)
  async buscarPorEmail(email: string) {
    return Usuario.findOne({ email: email.toLowerCase() });
  }

  // busca pelo e-mail trazendo a senha (só usado no login)
  async buscarPorEmailComSenha(email: string) {
    return Usuario.findOne({ email: email.toLowerCase() }).select("+senha");
  }
}