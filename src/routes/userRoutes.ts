import { Router } from "express";
import { userController } from "../controller/userController";
import { userValidator, userUpdateValidator } from "../validator/uesrValidator";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { RoleUser } from "../type/interface/enum/rolesUser";

const router = Router()

// GET /user/:id
router.get('/:id', userController.getUserById)

// GET /user
router.get('/', userController.getUserAll)

// POST /user
router.post('/', authorizeRoles(RoleUser.admin), userValidator, userController.createUser)

// PUT /user/:id
router.put('/:id', authorizeRoles(RoleUser.admin), userUpdateValidator, userController.updateUser)

// DELETE /user/:id
router.delete('/:id', authorizeRoles(RoleUser.admin), userController.deleteUser)

const routerGroup = Router()
routerGroup.use("/user",isAuthenticated, router)
export { routerGroup as userRoutes };