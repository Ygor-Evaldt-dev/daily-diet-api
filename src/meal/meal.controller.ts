import { inject, injectable } from "inversify";
import { Request, Response } from "express";


import { MealService } from "./meal.service";
import { HttpStatus } from "../common/http/http-status";
import { createMealSchema } from "./schemas";
import { handleRequestErrors } from "../common/http/handle-request-errors";
import { TYPES } from "../container-manegment/types";
import { findManyMealSchema } from "./schemas/find-many-meal.schema";
import { updateMealSchema } from "./schemas/update-meal.schema";
import { IAuthRequest } from "../routes/middlewares";

@injectable()
export class MealController {
    constructor(
        @inject(TYPES.MealService)
        private readonly mealService: MealService
    ) { }

    public async create(req: Request, res: Response) {
        try {
            const body = createMealSchema.parse({
                ...req.body,
                userId: (req as IAuthRequest).user.id
            });
            await this.mealService.create(body);

            res.sendStatus(HttpStatus.CREATED);
        } catch (error) {
            handleRequestErrors<typeof error>(res, error);
        }
    }

    public async findUnique(req: Request, res: Response) {
        try {
            const response = await this.mealService.findUnique(req.params.id);

            res.status(HttpStatus.OK).send(response);
        } catch (error) {
            handleRequestErrors<typeof error>(res, error);
        }
    }

    public async findMany(req: Request, res: Response) {
        try {
            const { page, take } = findManyMealSchema.parse(req.params);

            const response = await this.mealService.findMany({
                userId: (req as IAuthRequest).user.id,
                page,
                take
            });

            res.status(HttpStatus.OK).send(response);
        } catch (error) {
            handleRequestErrors<typeof error>(res, error);
        }
    }

    public async summary(req: Request, res: Response) {
        try {
            const userId = (req as IAuthRequest).user.id;

            const [meals, { bestSequence }, insideDiet] = await Promise.all([
                this.mealService.findTotalOfMeals(userId),
                this.mealService.findTotalMealsOfTheBestSequencyWithinDiet(userId),
                this.mealService.findTotalOfMealsRegardingDiet(userId)
            ]);

            res.status(HttpStatus.OK).send({
                totalOfMeals: meals.total,
                bestSequence,
                totalInsideDiet: insideDiet.total
            });
        } catch (error) {
            handleRequestErrors<typeof error>(res, error);
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const body = updateMealSchema.parse({
                ...req.body
            });
            await this.mealService.update(req.params.id, body);

            res.sendStatus(HttpStatus.OK);
        } catch (error) {
            handleRequestErrors<typeof error>(res, error);
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            await this.mealService.delete(req.params.id);
            res.sendStatus(HttpStatus.OK);
        } catch (error) {
            handleRequestErrors<typeof error>(res, error);
        }
    }
}