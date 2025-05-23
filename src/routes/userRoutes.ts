import { Router } from "express";
import { userController } from "../controller/userController";
import { userValidator } from "../validator/uesrValidator";

const router = Router()

// GET /user/:id
router.get('/:id',userController.getUserById)

// GET /user
router.get('/', userController.getUserAll)

// POST /user
router.post('/', userValidator, userController.createUser)

// PUT /user/:id
router.put('/:id', userValidator, userController.updateUser)

// DELETE /user/:id
router.delete('/:id', userController.deleteUser)

const routerGroup = Router()
routerGroup.use("/user", router)
export { routerGroup as userRoutes };