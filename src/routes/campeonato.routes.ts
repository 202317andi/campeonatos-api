import { Router } from "express";
import { CampeonatoController } from "../controllers/campeonato.controller";
import { autenticar } from "../middlewares/auth.middleware"; // o "segurança"

const router = Router(); // um "mini app" só de rotas
const controller = new CampeonatoController();

// públicas: qualquer um pode ver
router.get("/", controller.listar);                 // lista
router.get("/:id", controller.buscarPorId);         // busca um

// protegidas: precisa do token
router.post("/", autenticar, controller.criar);                 // cria
router.put("/:id", autenticar, controller.atualizar);           // atualiza
router.delete("/:id", autenticar, controller.excluir);          // exclui
router.post("/:id/times", autenticar, controller.adicionarTime); // inscreve time

export default router;