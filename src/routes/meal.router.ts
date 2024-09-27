import { Router } from "express";
import container from "../container";

import { MealController } from "../meal";

const router = Router();
const mealController = container.get<MealController>(MealController);

router.use("/", (req, res) => mealController.create(req, res));

export default router;