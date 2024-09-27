import { inject, injectable } from "inversify";
import { Request, Response } from "express";


import { MealService } from "./meal.service";
import { HttpStatus } from "../common/http/http-status";
import { createMealSchema } from "./schemas";
import { handleRequestErrors } from "../common/http/handle-request-errors";

@injectable()
export class MealController {
    constructor(
        @inject("MealService")
        private readonly mealService: MealService
    ) { }

    public async create(req: Request, res: Response) {
        try {
            const body = createMealSchema.parse(req.body);
            await this.mealService.create(body);

            res.sendStatus(HttpStatus.CREATED);
        } catch (error) {
            handleRequestErrors<typeof error>(res, error);
        }
    }
}