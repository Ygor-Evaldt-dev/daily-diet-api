import { execSync } from "node:child_process";
import request from "supertest";
import {
    beforeEach,
    describe,
    expect,
    it
} from "vitest";

import { app } from "../../src/app";
import { HttpStatus } from "../../src/common/http/http-status";

describe.only("user controller", () => {
    beforeEach(() => {
        execSync("npm run knex migrate:rollback --all");
        execSync("npm run knex migrate:latest");
    });

    it("should create a new user", async () => {
        const body = {
            email: "admin@gmail.com",
            password: "admin@123"
        };
        const response = await request(app)
            .post("/user")
            .send(body);

        expect(response.status).toBe(HttpStatus.CREATED);
    });

    it("should update an user already registred", async () => {
        const body = {
            email: "admin@gmail.com",
            password: "admin@123"
        };
        await request(app)
            .post("/user")
            .send(body);

        const getUserResponse = await request(app)
            .get(`/user/${body.email}`);

        const { user } = getUserResponse.body;

        const updatedBody = {
            ...body,
            email: "update@gmail.com"
        };

        await request(app)
            .put(`/user/${user.id}`)
            .send(updatedBody);

        const getUserUpdatedResponse = await request(app)
            .get(`/user/${updatedBody.email}`);

        expect(getUserUpdatedResponse.status).toBe(HttpStatus.OK);
        expect(getUserUpdatedResponse.body.user.email).toEqual(updatedBody.email);
    });

    it("should find an user already registered by e-mail", async () => {
        const body = {
            email: "admin@gmail.com",
            password: "admin@123"
        };
        await request(app)
            .post("/user")
            .send(body);

        const getUserResponse = await request(app)
            .get(`/user/${body.email}`);

        expect(getUserResponse.status).toBe(HttpStatus.OK);
        expect(getUserResponse.body.user.email).toEqual(body.email);
    });
});