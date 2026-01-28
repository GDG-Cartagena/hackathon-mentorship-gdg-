import { Router } from "express";
import { TodoController } from "./controller.todo.js";
// import {authMiddleware } from '../../middleware/auth.js'

const router = Router();
const controller = new TodoController();

router.get("/", controller.getAll);
// router.post('/', authMiddleware, controller.create); //ejemplo de un una ruta restringida
router.post("/", controller.create);

export default router;
