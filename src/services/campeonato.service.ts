import { isValidObjectId } from "mongoose";
import { CampeonatoRepository } from "../repositories/campeonato.repository";
import { ICampeonato, ITime } from "../models/campeonato.model";
import { AppError } from "../middlewares/error.middleware";

export class CampeonatoService {
  private repository = new CampeonatoRepository(); // o "almoxarife"

  async criar(dados: ICampeonato) {
    this.validarDatas(dados.dataInicio, dados.prazoInscricao);
    return this.repository.criar(dados);
  }

  async listar() {
    return this.repository.listar();
  }

  async buscarPorId(id: string) {
    this.validarId(id);
    const campeonato = await this.repository.buscarPorId(id);
    if (!campeonato) {
      throw new AppError("Campeonato não encontrado", 404);
    }
    return campeonato;
  }

  async atualizar(id: string, dados: Partial<ICampeonato>) {
    const atual = await this.buscarPorId(id); // garante que existe

    // se não mandou a data nova, usa a que já estava salva
    const dataInicio = dados.dataInicio ?? atual.dataInicio;
    const prazo = dados.prazoInscricao ?? atual.prazoInscricao;
    this.validarDatas(dataInicio, prazo);

    return this.repository.atualizar(id, dados);
  }

  async excluir(id: string) {
    await this.buscarPorId(id); // dá 404 se não existir
    await this.repository.excluir(id);
  }

  // inscreve um time no campeonato
  async adicionarTime(id: string, time: ITime) {
    const campeonato = await this.buscarPorId(id);

    if (new Date() > campeonato.prazoInscricao) {
      throw new AppError("Prazo de inscrição encerrado", 400);
    }
    if (campeonato.times.length >= campeonato.maxTimes) {
      throw new AppError("Campeonato lotado", 400);
    }

    const nomeRepetido = campeonato.times.some(
      (t) => t.nome.toLowerCase() === time.nome.toLowerCase()
    );
    if (nomeRepetido) {
      throw new AppError("Já existe um time com esse nome", 409);
    }
    
        // não pode ter camisa repetida no mesmo time
    const numeros = (time.jogadores ?? []).map((j) => j.numeroCamisa);
    if (new Set(numeros).size !== numeros.length) {
      throw new AppError("Número de camisa repetido no time", 400);
    }

    campeonato.times.push(time); // adiciona na lista
    return campeonato.save();    // salva no banco
  }

  // ===== regras internas =====

  private validarId(id: string) {
    if (!isValidObjectId(id)) {
      throw new AppError("ID inválido", 400);
    }
  }

  private validarDatas(dataInicio: Date, prazo: Date) {
    if (new Date(prazo) > new Date(dataInicio)) {
      throw new AppError("O prazo de inscrição deve ser antes da data de início", 400);
    }
  }
}