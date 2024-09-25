import { knex } from "../database";
import { UserService } from "../user/user.service";
import { CreateMealDto } from "./dtos";

export class MealService {
    constructor(
        private readonly userService: UserService
    ) { }

    public async create({ name, description, userId }: CreateMealDto) {
        await this.userService.findUnique({ id: userId });

        await knex("meal").insert({
            name,
            description,
            user_id: userId
        });
    }
}