import { Router } from 'express';
import { healthController } from '../controller/healthController';

const router = Router();

// GET /health
router.get('/health', healthController.getHealth);
export { router as healthRoutes };
