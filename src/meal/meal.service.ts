import { randomUUID } from "node:crypto";
import { inject, injectable } from "inversify";

import { knex } from "../database";
import { UserService } from "../user/user.service";
import { CreateMealDto, FindManyMealDto, UpdateMealDto } from "./dtos";
import { NotFoundException } from "../common/exceptions/not-found.exception";
import { Meal } from "knex/types/tables";
import { TYPES } from "../container-manegment/types";

@injectable()
export class MealService {
    constructor(
        @inject(TYPES.UserService)
        private readonly userService: UserService
    ) { }

    public async create({
        name,
        description,
        createdAt,
        isOnDiet,
        userId
    }: CreateMealDto) {
        await this.userService.findUnique({ id: userId });

        await knex("meal").insert({
            id: randomUUID(),
            name,
            description,
            is_on_diet: isOnDiet,
            created_at: new Date(createdAt),
            user_id: userId
        });
    }

    public async findUnique(id: string) {
        const meal = await knex("meal").where({ id }).first();
        if (!meal) {
            throw new NotFoundException("Meal not found");
        }

        return { meal };
    }

    public async findMany({
        userId = "",
        page = 0,
        take = 25
    }: FindManyMealDto) {
        const getMealsPromise = knex("meal")
            .where({ user_id: userId })
            .limit(take)
            .offset(page * take)
            .select();

        const [{ total }, meals] = await Promise.all([
            this.findTotalOfMeals(userId),
            getMealsPromise
        ]);

        if (meals.length === 0) {
            throw new NotFoundException("No meal found");
        }

        return { meals, page, take, total };
    }

    public async findTotalOfMeals(userId: string) {
        const [{ total }] = await knex("meal")
            .select()
            .where({ user_id: userId })
            .count("id", { as: "total" });

        return { total: Number(total) };
    }

    public async findTotalOfMealsRegardingDiet(
        userId: string,
        isOnDiet: boolean = false
    ) {
        const [{ total }] = await knex("meal")
            .select()
            .where({
                is_on_diet: isOnDiet,
                user_id: userId
            })
            .count("id", { as: "total" });

        return { total: Number(total) };
    }

    public async findTotalMealsOfTheBestSequencyWithinDiet(userId: string) {
        let currentSequence = 0;
        let bestSequence = 0;

        const mealStream = knex("meal")
            .select("is_on_diet")
            .where({ user_id: userId })
            .stream();

        await new Promise((resolve, reject) => {
            mealStream
                .on("data", (meal: Meal) => {
                    if (meal.is_on_diet) {
                        currentSequence++;
                    } else {
                        bestSequence = Math.max(bestSequence, currentSequence);
                        currentSequence = 0;
                    }
                })
                .on("end", () => {
                    bestSequence = Math.max(bestSequence, currentSequence);
                    resolve(bestSequence);
                })
                //eslint-disable-next-line
                .on("error", (error: any) => {
                    reject(error);
                });
        });

        return { bestSequence };
    }

    public async update(id: string = "", {
        name,
        description,
        isOnDiet,
        createdAt,
    }: UpdateMealDto) {
        const { meal } = await this.findUnique(id);

        await knex("meal")
            .update({
                name: name || meal.name,
                description: description || meal.description,
                is_on_diet: isOnDiet === false ? isOnDiet : meal.is_on_diet,
                created_at: createdAt ? new Date(createdAt) : meal.created_at
            })
            .where({ id });
    }

    public async delete(id: string) {
        await this.findUnique(id);

        await knex("meal").where({ id }).delete();
    }
}