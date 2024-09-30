import { Router } from "express";
import container from "../container-manegment/container";

import { MealController } from "../meal/";
import { TYPES } from "../container-manegment/types";

const router = Router();
const mealController = container.get<MealController>(TYPES.MealController);

router.post("/", (req, res) => mealController.create(req, res));

export default router;