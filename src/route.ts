import { Router } from 'express';
import { healthRoutes } from './routes/healthRoutes';
import { userRoutes } from './routes/userRoutes';
import { authRoutes } from './routes/authRoutes';

const router = Router();

// API version prefix: /api/v1
const API_VERSION = '/api/v1';

// Mount all routes with API version prefix
router.use(healthRoutes);
router.use(userRoutes);
router.use(authRoutes);

export { router as mainRouter };
