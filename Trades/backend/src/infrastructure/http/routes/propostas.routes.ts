import { Router, Request, Response } from 'express';
import { PropostaTrocaFactory } from '../../../factories/PropostaTrocaFactory.js';

const router = Router();
const controller = PropostaTrocaFactory.criarController();

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
router.get('/propostas', (req: Request, res: Response) => controller.listar(req, res));

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
  const ctrl = controller as any;
  if (typeof ctrl.buscarPorId === 'function') return ctrl.buscarPorId(req, res);
  if (typeof ctrl.obterPorId === 'function') return ctrl.obterPorId(req, res);
  if (typeof ctrl.buscar === 'function') return ctrl.buscar(req, res);
  return controller.listar(req, res);
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
router.post('/propostas', (req: Request, res: Response) => controller.criar(req, res));

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
router.patch('/propostas/:id/responder', (req: Request, res: Response) => controller.responder(req, res));

export default router;