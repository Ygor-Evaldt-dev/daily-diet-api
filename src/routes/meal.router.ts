import { Router } from "express";
import container from "../container-manegment/container";

import { MealController } from "../meal/";
import { TYPES } from "../container-manegment/types";

const router = Router();
const mealController = container.get<MealController>(TYPES.MealController);

router.post("/", (req, res) => mealController.create(req, res));
router.get("/:userId/:page/:take", (req, res) => mealController.findMany(req, res));
router.get("/:id", (req, res) => mealController.findUnique(req, res));
router.delete("/:id", (req, res) => mealController.delete(req, res));

export default router;