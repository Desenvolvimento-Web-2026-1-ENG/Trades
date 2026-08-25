import { Router, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../docs/swagger";


const router = Router();

// Expõe o JSON cru para importação (ex: Postman) no endpoint /api-docs/json
router.get("/json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Renderiza a interface gráfica na raiz deste roteador
router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
