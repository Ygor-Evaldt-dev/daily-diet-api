import { inject, injectable } from "inversify";
import { Request, Response } from "express";


import { MealService } from "./meal.service";
import { HttpStatus } from "../common/http/http-status";

@injectable()
export class MealController {
    constructor(
        @inject("MealService")
        private readonly mealService: MealService
    ) { }

    public async create(req: Request, res: Response) {
        res.sendStatus(HttpStatus.CREATED);
    }
}