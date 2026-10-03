import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const controller = new AuthController();

router.post("/registrar", controller.registrar); // cadastro
router.post("/login", controller.login);         // login

export default router;