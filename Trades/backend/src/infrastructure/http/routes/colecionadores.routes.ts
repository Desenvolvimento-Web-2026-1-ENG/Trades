import { Router, Request, Response } from 'express';
import { ColecionadorFactory } from '@factories/ColecionadorFactory.js';

const router = Router();
const controller = ColecionadorFactory.criarController();

/**
 * @swagger
 * /api/colecionadores:
 *   get:
 *     summary: Lista todos os colecionadores cadastrados
 *     tags: [Colecionadores]
 */
router.get('/colecionadores', (req: Request, res: Response) => controller.listar(req, res));

/**
 * @swagger
 * /api/colecionadores/{id}:
 *   get:
 *     summary: Busca um colecionador por ID
 *     tags: [Colecionadores]
 */
router.get('/colecionadores/:id', (req: Request, res: Response) => controller.buscarPorId(req, res));

/**
 * @swagger
 * /api/colecionadores:
 *   post:
 *     summary: Cadastra um novo perfil (Colecionador ou Administrador)
 *     tags: [Colecionadores]
 */
router.post('/colecionadores', (req: Request, res: Response) => controller.criar(req, res));

/**
 * @swagger
 * /api/colecionadores/{id}:
 *   delete:
 *     summary: Remove um colecionador da plataforma
 *     tags: [Colecionadores]
 */
router.delete('/colecionadores/:id', (req: Request, res: Response) => controller.excluir(req, res));

export default router;