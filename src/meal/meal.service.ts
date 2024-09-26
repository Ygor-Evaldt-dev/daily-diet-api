import { randomUUID } from "node:crypto";
import { knex } from "../database";
import { UserService } from "../user/user.service";
import { CreateMealDto, FindManyMealDto } from "./dtos";
import { NotFoundException } from "../common/exceptions/not-found.exception";

export class MealService {
    constructor(
        private readonly userService: UserService
    ) { }

    public async create({ name, description, createdAt, isOnDiet, userId }: CreateMealDto) {
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
            throw new NotFoundException("Refeição não cadastrada");
        }

        return { meal };
    }

    public async findMany({ userId, page, take }: FindManyMealDto) {
        const getTotalPromise = knex("meal")
            .select()
            .where({ user_id: userId })
            .count("id", { as: "total" });

        const getMealsPromise = knex("meal")
            .where({ user_id: userId })
            .limit(take)
            .offset(page * take)
            .select();

        const [total, meals] = await Promise.all([
            getTotalPromise,
            getMealsPromise
        ]);

        if (meals.length === 0) {
            throw new NotFoundException("Nenhuma refeição não cadastrada");
        }

        return {
            meals,
            page,
            take,
            total: total[0].total
        };
    }

    public async delete(id: string) {
        await this.findUnique(id);

        await knex("meal").where({ id }).delete();
    }
}