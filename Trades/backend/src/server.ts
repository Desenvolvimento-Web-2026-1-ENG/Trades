import express, { Request, Response } from "express";
import cors from "cors";
import itemRoutes from "./routes/item.routes.js";
import propostaRoutes from "./routes/proposta.routes.js";
import colecionadorRoutes from "./routes/colecionador.routes.js";

const PORTA = 3000;
const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*']
}));

app.use(express.json());

// Rotas principais da API
app.use('/api', colecionadorRoutes);
app.use('/api', itemRoutes);
app.use('/api', propostaRoutes);

// Rotas de verificação do servidor
app.get('/api/status', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'Online', 
    mensagem: 'API do Gerenciador de Colecionadores rodando!' 
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'Healthy', 
    mensagem: 'O servidor está saudável e funcionando corretamente!' 
  });
});

// Iniciando o servidor na porta definida
app.listen(PORTA, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
});