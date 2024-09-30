import { inject, injectable } from "inversify";
import { Request, Response } from "express";


import { MealService } from "./meal.service";
import { HttpStatus } from "../common/http/http-status";
import { createMealSchema } from "./schemas";
import { handleRequestErrors } from "../common/http/handle-request-errors";
import { TYPES } from "../container-manegment/types";
import { findManyMealSchema } from "./schemas/find-many-meal.schema";

@injectable()
export class MealController {
    constructor(
        @inject(TYPES.MealService)
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
            const { userId, page, take } = findManyMealSchema.parse(req.params);

            const response = await this.mealService.findMany({
                userId,
                page,
                take
            });

            res.status(HttpStatus.OK).send(response);
        } catch (error) {
            handleRequestErrors<typeof error>(res, error);
        }
    }
}