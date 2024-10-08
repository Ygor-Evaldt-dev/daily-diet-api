import { describe, it, beforeEach, expect } from "vitest";
import { handleMigrations } from "../utils/handle-migrations";
import { UserService } from "../../src/user/user.service";
import { MealService } from "../../src/meal/meal.service";
import { CreateMealDto, FindManyMealDto } from "../../src/meal/dtos";
import { CreateUserDto } from "../../src/user/dtos";
import { TYPES } from "../../src/container-manegment/types";
import container from "../../src/container-manegment/container";

describe("meal service", () => {
    const currentDate = new Date();

    const userService = container.get<UserService>(TYPES.UserService);
    const mealService = container.get<MealService>(TYPES.MealService);

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

    const findManyDto: FindManyMealDto = {
        page: 0,
        take: 25,
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

        it("should throw not found exception if user is not already registered", async () => {
            const exec = async () => await mealService.create({
                ...createMealDto,
                userId: "fake-uuid"
            });

            expect(exec).rejects.toThrow();
        });
    });

    describe("findUnique", () => {
        it("should get a meal already registered", async () => {
            await userService.create(createUserDto);
            const { user } = await userService.findUnique({ email: createUserDto.email });

            await mealService.create({ ...createMealDto, userId: user.id });

            const { meals } = await mealService.findMany({ ...findManyDto, userId: user.id });
            const { meal } = await mealService.findUnique(meals[0].id);

            expect(meal).toBeDefined();
            expect(meal.id).toEqual(meals[0].id);
        });

        it("should throw not found exception if meal is not already registered", async () => {
            const mealIdNotRegistered = "fake-id";
            const exec = async () => await mealService.findUnique(mealIdNotRegistered);

            expect(exec).rejects.toThrow();
        });

    });

    describe("find many", () => {
        it("should get all meals from an user", async () => {
            await userService.create(createUserDto);
            const { user } = await userService.findUnique({ email: createUserDto.email });

            await Promise.all([
                mealService.create({ ...createMealDto, userId: user.id }),
                mealService.create({ ...createMealDto, userId: user.id, isOnDiet: false })
            ]);

            const { meals, total, page, take } = await mealService.findMany({
                ...findManyDto,
                userId: user.id
            });

            expect(meals.length).toBeGreaterThan(0);
            expect(total).toEqual(2);
            expect(page).toEqual(findManyDto.page);
            expect(take).toEqual(findManyDto.take);

            meals.forEach(({ user_id }) => {
                expect(user_id).toEqual(user.id);
            });
        });

        it("should throw not found exception if user has not any meal already registered", async () => {
            await userService.create(createUserDto);
            const { user } = await userService.findUnique({ email: createUserDto.email });

            const exec = async () => await mealService.findMany({
                ...findManyDto,
                userId: user.id
            });

            expect(exec).rejects.toThrow();
        });
    });

    describe("find total of meals", () => {
        it("should return the total of meals", async () => {
            await userService.create(createUserDto);
            const { user } = await userService.findUnique({ email: createUserDto.email });

            await Promise.all([
                mealService.create({ ...createMealDto, userId: user.id }),
                mealService.create({ ...createMealDto, userId: user.id })
            ]);

            const { total } = await mealService.findTotalOfMeals(user.id);
            expect(total).toEqual(2);
        });
    });

    describe("find the best sequency of meals within the diet", () => {
        it("should return the best sequescy", async () => {
            await userService.create(createUserDto);
            const { user } = await userService.findUnique({ email: createUserDto.email });

            await Promise.all([
                mealService.create({
                    ...createMealDto,
                    userId: user.id
                }),
                mealService.create({
                    ...createMealDto,
                    userId: user.id
                }),
                mealService.create({
                    ...createMealDto,
                    userId: user.id,
                    isOnDiet: false
                }),
                mealService.create({
                    ...createMealDto,
                    userId: user.id,
                    isOnDiet: false
                }),
                mealService.create({
                    ...createMealDto,
                    userId: user.id
                }),
                mealService.create({
                    ...createMealDto,
                    userId: user.id,
                    isOnDiet: false
                })
            ]);

            const { bestSequence } = await mealService
                .findTotalMealsOfTheBestSequencyWithinDiet(user.id);

            expect(bestSequence).toEqual(2);
        });
    });

    describe("find total of meals regarding the diet", () => {
        it("should return the total of meals within the diet", async () => {
            await userService.create(createUserDto);
            const { user } = await userService.findUnique({ email: createUserDto.email });

            await Promise.all([
                mealService.create({
                    ...createMealDto,
                    userId: user.id
                }),
                mealService.create({
                    ...createMealDto,
                    userId: user.id
                }),
                mealService.create({
                    ...createMealDto,
                    userId: user.id,
                    isOnDiet: false
                })
            ]);

            const { total } = await mealService.findTotalOfMealsRegardingDiet(user.id, true);

            expect(total).toEqual(2);
        });

        it("should return the total of meals outside the diet", async () => {
            await userService.create(createUserDto);
            const { user } = await userService.findUnique({ email: createUserDto.email });

            await Promise.all([
                mealService.create({
                    ...createMealDto,
                    userId: user.id
                }),
                mealService.create({
                    ...createMealDto,
                    userId: user.id
                }),
                mealService.create({
                    ...createMealDto,
                    userId: user.id,
                    isOnDiet: false
                })
            ]);

            const { total } = await mealService.findTotalOfMealsRegardingDiet(user.id);

            expect(total).toEqual(1);
        });
    });

    describe("update", () => {
        it("should update an user meal already registered", async () => {
            await userService.create(createUserDto);
            const { user } = await userService.findUnique({ email: createUserDto.email });

            await mealService.create({ ...createMealDto, userId: user.id });
            const { meals } = await mealService.findMany({
                ...findManyDto,
                userId: user.id
            });

            const meal = meals[0];

            const exec = async () => await mealService.update(meal.id, {
                name: "nome atualizado",
                description: "descrição atualizada",
                isOnDiet: false,
            });

            await expect(exec()).resolves.not.toThrow();
        });
    });

    describe("delete", () => {
        it("should delete a meal already registered", async () => {
            await userService.create(createUserDto);
            const { user } = await userService.findUnique({ email: createUserDto.email });

            await mealService.create({ ...createMealDto, userId: user.id });
            const { meals } = await mealService.findMany({
                ...findManyDto,
                userId: user.id
            });

            const exec = async () => await mealService.delete(meals[0].id);

            await expect(exec()).resolves.not.toThrow();
        });

        it("should throw not found exception if meal is not already registered", async () => {
            const exec = async () => await mealService.delete("fake-id");
            await expect(exec()).rejects.toThrow();
        });

    });
});