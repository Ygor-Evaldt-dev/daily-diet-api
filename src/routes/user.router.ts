import { Router } from "express";
import container from "../container";
import { UserController } from "../user/user.controller";

const router = Router();
const userController = container.get<UserController>(UserController);

router.post("/", (req, res) => userController.create(req, res));
router.get("/:email", (req, res) => userController.findUnique(req, res));
router.put("/:id", (req, res) => userController.update(req, res));

export default router;
