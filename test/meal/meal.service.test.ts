import { describe, it, beforeEach, expect } from "vitest";
import { handleMigrations } from "../utils/handle-migrations";
import { UserService } from "../../src/user/user.service";
import { BcryptAdapter } from "../../src/adapters/bcrypt.adapter";
import { MealService } from "../../src/meal/meal.service";
import { CreateMealDto } from "../../src/meal/dtos";
import { CreateUserDto } from "../../src/user/dtos";

describe("meal service", () => {
    const currentDate = new Date();

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
        createdAt: `${currentDate}`,
        isOnDiet: true,
        userId: ""
    };

    beforeEach(() => {
        handleMigrations();
    });

    describe("create", () => {
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

        it("should throw not found exception if user is not already registred", async () => {
            const exec = async () => await mealService.create({
                ...createMealDto,
                userId: "fake-uuid"
            });

            expect(exec).rejects.toThrow("Usuário não cadastrado");
        });
    });

    describe.only("delete", () => {
        it("should delete an existing meal", async () => {
            await userService.create(createUserDto);
            const { user } = await userService.findUnique({ email: createUserDto.email });

            await mealService.create({ ...createMealDto, userId: user.id });
            const { meals } = await mealService.findMany();

            const exec = async () => await mealService.delete(meals[0].id);

            await expect(exec()).resolves.not.toThrow();
        });
    });
});