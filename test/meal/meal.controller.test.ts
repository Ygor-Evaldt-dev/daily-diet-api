import { execSync } from "node:child_process";
import request from "supertest";

import { app } from "../../src/app";
import { HttpStatus } from "../../src/common/http/http-status";

import {
    beforeEach,
    describe,
    expect,
    it
} from "vitest";

describe("meal controller", () => {
    const bodyToCreateUser = {
        email: "admin@gmail.com",
        password: "admin@123"
    };
    const credentials = btoa(`${bodyToCreateUser.email}:${bodyToCreateUser.password}`);

    const bodyToCreateMeal = {
        name: "Almoço",
        description: "descrição com no mínimo 10 caracteres",
        isOnDiet: true,
        createdAt: "2024-09-30T15:29:28.995Z"
    };

    beforeEach(() => {
        execSync("npm run knex migrate:rollback --all");
        execSync("npm run knex migrate:latest");
    });

    it("should create a meal to especific user", async () => {
        await request(app)
            .post("/user")
            .send(bodyToCreateUser);

        const response = await request(app)
            .post("/meal")
            .set("Authorization", `Basic ${credentials}`)
            .send(bodyToCreateMeal);

        expect(response.status).toBe(HttpStatus.CREATED);
    });

    it("should update a meal already registred", async () => {
        await request(app)
            .post("/user")
            .send(bodyToCreateUser);

        await request(app)
            .post("/meal")
            .set("Authorization", `Basic ${credentials}`)
            .send(bodyToCreateMeal);

        const responseToGetMeal = await request(app)
            .get("/meal/0/1")
            .set("Authorization", `Basic ${credentials}`);


        const meal = responseToGetMeal.body.meals[0];

        const responseToUpdateMeal = await request(app)
            .put(`/meal/${meal.id}`)
            .set("Authorization", `Basic ${credentials}`)
            .send({
                ...bodyToCreateMeal,
                isOnDiet: false
            });

        const responseToGetMealById = await request(app)
            .get(`/meal/${meal.id}`)
            .set("Authorization", `Basic ${credentials}`);

        expect(responseToUpdateMeal.status).toBe(HttpStatus.OK);
        expect(responseToGetMealById.body.meal.isOnDiet).toBeFalsy();
    });

    it("should to find meals from a specific user", async () => {
        await request(app)
            .post("/user")
            .send(bodyToCreateUser);

        await Promise.all([
            request(app)
                .post("/meal")
                .set("Authorization", `Basic ${credentials}`)
                .send(bodyToCreateMeal),
            request(app)
                .post("/meal")
                .set("Authorization", `Basic ${credentials}`)
                .send(bodyToCreateMeal)
        ]);

        const page = 0;
        const take = 10;
        const response = await request(app)
            .get(`/meal/${page}/${take}`)
            .set("Authorization", `Basic ${credentials}`);

        const { meals, total } = response.body;

        expect(meals.length).toEqual(2);
        expect(total).toEqual(2);
        expect(response.body.page).toEqual(page);
        expect(response.body.take).toEqual(take);
    });

    it.only("should to find an specific meal", async () => {
        await request(app)
            .post("/user")
            .send(bodyToCreateUser);

        await request(app)
            .post("/meal")
            .set("Authorization", `Basic ${credentials}`)
            .send(bodyToCreateMeal);

        const responseToGetMeal = await request(app)
            .get("/meal/0/1")
            .set("Authorization", `Basic ${credentials}`);

        const response = await request(app)
            .get(`/meal/${responseToGetMeal.body.meals[0].id}`)
            .set("Authorization", `Basic ${credentials}`);

        const { meal } = response.body;
        console.log("meal", meal);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(meal.id).toEqual(responseToGetMeal.body.meals[0].id);
    });
});