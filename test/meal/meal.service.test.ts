import { describe, it, beforeEach, expect } from "vitest";
import { handleMigrations } from "../utils/handle-migrations";
import { UserService } from "../../src/user/user.service";
import { BcryptAdapter } from "../../src/adapters/bcrypt.adapter";
import { MealService } from "../../src/meal/meal.service";
import { CreateMealDto } from "../../src/meal/dtos";
import { CreateUserDto } from "../../src/user/dtos";

describe("meal service", () => {
    const encrypter = new BcryptAdapter();
    const userService = new UserService(encrypter);
    const mealService = new MealService(userService);

    const createUserDto: CreateUserDto = {
        email: "email@gmail.com",
        password: "any@password123"
    };

    const createMealDto: CreateMealDto = {
        name: "Alimentação saudável",
        description: "Arroz com cenoura, tomate e alface",
        userId: ""
    };

    beforeEach(() => {
        handleMigrations();
    });

    describe.only("create", () => {
        it("should create a new meal", async () => {
            await userService.create(createUserDto);
            const { user } = await userService.findUnique({
                email: createUserDto.email
            });

            const exec = async () => await mealService.create({
                ...createMealDto,
                userId: user.id
            });

            await expect(exec()).resolves.not.toThrow();
        });
    });
});