import { Campeonato, ICampeonato } from "../models/campeonato.model";

export class CampeonatoRepository {
  // salva um campeonato novo no banco
  async criar(dados: ICampeonato) {
    return Campeonato.create(dados);
  }

  // busca todos os campeonatos
  async listar() {
    return Campeonato.find();
  }

  // busca um campeonato pelo id (ou null se não achar)
  async buscarPorId(id: string) {
    return Campeonato.findById(id);
  }

  // atualiza só os campos enviados e devolve a versão nova
  async atualizar(id: string, dados: Partial<ICampeonato>) {
    return Campeonato.findByIdAndUpdate(id, dados, {
      returnDocument: "after",
      runValidators: true, // aplica as regras do model também na edição
    });
  }

  // apaga um campeonato e devolve o que foi apagado (ou null)
  async excluir(id: string) {
    return Campeonato.findByIdAndDelete(id);
  }
}