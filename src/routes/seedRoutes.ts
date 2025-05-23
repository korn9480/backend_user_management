import { Router } from "express";
import { seedController } from "../controller/seedController";

const router = Router();

// POST /role-permission/seed - Seed role-permission data
router.post('/seed', seedController.seedRolePermissions);

const routerGroup = Router();
routerGroup.use("/role-permission", router);

export { routerGroup as seedRoutes };
