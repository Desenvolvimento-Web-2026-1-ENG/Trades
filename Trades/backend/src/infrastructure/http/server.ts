import express, { Request, Response } from "express";
import colecionadoresRoutes from "./routes/colecionadores.routes.js";
import itensRoutes from "./routes/itens.routes.js";
import propostasRoutes from "./routes/propostas.routes.js";
// 1. Importe as rotas do swagger (ajuste o nome do arquivo se for diferente de docs.routes.js)
import docsRoutes from "./routes/docs.routes.js"; 

const PORTA = 3000;

const app = express();

app.use(express.json());

// 2. Registre o Swagger na rota /docs
app.use('/docs', docsRoutes);

// Registro das demais rotas da API
app.use('/api', colecionadoresRoutes);
app.use('/api', itensRoutes);
app.use('/api', propostasRoutes);

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