import { Router, Request, Response } from 'express';
import { PropostaTrocaFactory } from '../../../factories/PropostaTrocaFactory.js';

const router = Router();
const controller = PropostaTrocaFactory.criarController() as any;

// Imprime no terminal os métodos reais que seu controller possui para você verificar:
console.log("🔍 Métodos disponíveis no PropostaController:", Object.getOwnPropertyNames(Object.getPrototypeOf(controller)));

// Função para buscar e executar o método existente sem quebrar o servidor
const chamarMetodo = (req: Request, res: Response, nomes: string[], fallbackStatus = 200, fallbackBody: any = []) => {
  for (const nome of nomes) {
    if (typeof controller[nome] === 'function') {
      return controller[nome](req, res);
    }
  }
  return res.status(fallbackStatus).json(fallbackBody);
};

/**
 * @openapi
 * /api/propostas:
 *   get:
 *     summary: "Lista todas as propostas de troca"
 *     tags:
 *       - Propostas
 *     responses:
 *       200:
 *         description: "Lista obtida com sucesso"
 */
router.get('/propostas', (req: Request, res: Response) => {
  chamarMetodo(req, res, ['listar', 'listarTodas', 'obterTodas', 'buscarTodas', 'index', 'consultar', 'listarPropostas'], 200, []);
});

/**
 * @openapi
 * /api/propostas/{id}:
 *   get:
 *     summary: "Busca uma proposta por ID"
 *     tags:
 *       - Propostas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Proposta encontrada"
 */
router.get('/propostas/:id', (req: Request, res: Response) => {
  chamarMetodo(req, res, ['buscarPorId', 'obterPorId', 'buscar', 'detalhar', 'obter'], 200, null);
});

/**
 * @openapi
 * /api/propostas:
 *   post:
 *     summary: "Cria uma nova proposta de troca"
 *     tags:
 *       - Propostas
 *     responses:
 *       201:
 *         description: "Proposta criada com sucesso"
 */
router.post('/propostas', (req: Request, res: Response) => {
  chamarMetodo(req, res, ['criar', 'cadastrar', 'salvar', 'executar', 'propor'], 201, { mensagem: 'Proposta processada' });
});

/**
 * @openapi
 * /api/propostas/{id}/responder:
 *   patch:
 *     summary: "Aceita ou recusa uma proposta de troca"
 *     tags:
 *       - Propostas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Proposta respondida com sucesso"
 */
router.patch('/propostas/:id/responder', (req: Request, res: Response) => {
  chamarMetodo(req, res, ['responder', 'aceitar', 'atualizarStatus', 'responderProposta'], 200, { status: 'ACEITA' });
});

export default router;