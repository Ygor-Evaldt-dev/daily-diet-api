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

    it.only("should create a meal to especific user", async () => {
        await request(app)
            .post("/user")
            .send(bodyToCreateUser);

        const response = await request(app)
            .post("/meal")
            .set("Authorization", `Basic ${credentials}`)
            .send(bodyToCreateMeal);

        expect(response.status).toBe(HttpStatus.CREATED);
    });
});