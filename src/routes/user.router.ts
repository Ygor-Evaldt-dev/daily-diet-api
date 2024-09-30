import { Router } from "express";
import container from "../container-manegment/container";

import { UserController } from "../user";
import { TYPES } from "../container-manegment/types";

const router = Router();
const userController = container.get<UserController>(TYPES.UserController);

router.post("/", (req, res) => userController.create(req, res));
router.get("/:email", (req, res) => userController.findUnique(req, res));
router.put("/:id", (req, res) => userController.update(req, res));

export default router;
