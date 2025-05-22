import { Router } from 'express';
import { healthRoutes } from './routes/healthRoutes';

const router = Router();

// API version prefix: /api/v1
const API_VERSION = '/api/v1';

// Mount all routes with API version prefix
router.use(API_VERSION, healthRoutes);

export { router as mainRouter };
