import { Router } from "express";
import container from "../container-manegment/container";

import { MealController } from "../meal/";
import { TYPES } from "../container-manegment/types";
import { credentialsMiddleware } from "./middlewares";

const router = Router();
const mealController = container.get<MealController>(TYPES.MealController);

router.post("/", credentialsMiddleware, (req, res) => mealController.create(req, res));
router.get("/summary", credentialsMiddleware, (req, res) => mealController.summary(req, res));
router.get("/:page/:take", credentialsMiddleware, (req, res) => mealController.findMany(req, res));
router.get("/:id", credentialsMiddleware, (req, res) => mealController.findUnique(req, res));
router.put("/:id", credentialsMiddleware, (req, res) => mealController.update(req, res));
router.delete("/:id", credentialsMiddleware, (req, res) => mealController.delete(req, res));

export default router;