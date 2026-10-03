import express from "express";
import campeonatoRoutes from "./routes/campeonato.routes";
import swaggerUi from "swagger-ui-express";        
import { swaggerDocument } from "./docs/swagger"; 
import authRoutes from "./routes/auth.routes"; 
import { errorMiddleware } from "./middlewares/error.middleware"; // no topo, junto dos imports


export const app = express();

app.use(express.json()); // entende JSON

app.get("/", (req, res) => {
  res.json({ mensagem: "API funcionando!" });
});

// antes das rotas de campeonatos:
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// tudo que começa com /campeonatos vai pro router de campeonatos
app.use("/campeonatos", campeonatoRoutes);

app.use("/auth", authRoutes); 

// ...
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorMiddleware); // SEMPRE por último