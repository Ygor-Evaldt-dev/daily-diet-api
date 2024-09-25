import { randomUUID } from "crypto";
import { knex } from "../database";
import { UserService } from "../user/user.service";
import { CreateMealDto } from "./dtos";

export class MealService {
    constructor(
        private readonly userService: UserService
    ) { }

    public async create({ name, description, isOnDiet, userId }: CreateMealDto) {
        await this.userService.findUnique({ id: userId });

        await knex("meal").insert({
            id: randomUUID(),
            name,
            description,
            is_on_diet: isOnDiet,
            created_at: new Date(),
            user_id: userId
        });
    }
}