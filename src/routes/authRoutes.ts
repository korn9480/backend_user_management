import { Router } from "express";
import { authController } from "../controller/authController";
import { loginValidator } from "../validator/authValidator";
import { userController } from "../controller/userController";

const router = Router();

// POST /auth/login - User login
router.post('/login', loginValidator, authController.login);

// GET /auth/profile - Get user profile (requires token)
router.get('/me', authController.getProfile);

// POST /auth/verify - Verify token
router.post('/verify', authController.verifyToken);

// POST /auth/register - register
router.post('/register', userController.createUser)

const routerGroup = Router();
routerGroup.use("/auth", router);

export { routerGroup as authRoutes };
