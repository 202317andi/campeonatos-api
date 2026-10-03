import { Request, Response } from "express";
import { AuthService } from "../services/auth.service"; 

const service  = new AuthService();

export class AuthController {
    //POST /auth/registrar > cria usuário
    async registrar(req: Request, res: Response) {
        const usuario = await service.registrar(req.body);
        res.status(201).json(usuario); //201 criado
    }

    //POST /auth/login > devolve o token
    async login(req: Request, res: Response){
        const { email, senha} = req.body; //pega só o e-mail e senha do corpo
        const resultado = await service.login(email, senha);
        res.json(resultado); //200 OK
    }
}