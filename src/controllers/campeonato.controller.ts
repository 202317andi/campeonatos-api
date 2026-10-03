import { Request, Response } from "express";
import { CampeonatoService } from "../services/campeonato.service";

const service = new CampeonatoService(); // o "juiz"

export class CampeonatoController {
  // POST /campeonatos → cria
  async criar(req: Request, res: Response) {
    const campeonato = await service.criar(req.body);
    res.status(201).json(campeonato); // 201 = criado
  }

  // GET /campeonatos → lista todos
  async listar(req: Request, res: Response) {
    const campeonatos = await service.listar();
    res.json(campeonatos); // 200 = ok (padrão)
  }

  // GET /campeonatos/:id → busca um
  async buscarPorId(req: Request<{ id: string }>, res: Response) {
    const campeonato = await service.buscarPorId(req.params.id);
    res.json(campeonato); //
  }

  // PUT /campeonatos/:id → atualiza
  async atualizar(req: Request<{ id: string }>, res: Response) {
    const campeonato = await service.atualizar(req.params.id, req.body);
    res.json(campeonato);
  }

  // DELETE /campeonatos/:id → exclui
  async excluir(req: Request<{ id: string }>, res: Response) {
    await service.excluir(req.params.id);
    res.status(204).send(); // 204 = deu certo, sem conteúdo
  }

  // POST /campeonatos/:id/times → inscreve um time
  async adicionarTime(req: Request<{ id: string }>, res: Response) {
    const campeonato = await service.adicionarTime(req.params.id, req.body);
    res.status(201).json(campeonato);
  }
}