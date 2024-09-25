import { describe, it, expect, beforeEach } from "vitest";
import { UserService } from "../../src/user/user.service";
import { handleMigrations } from "../utils/handle-migrations";

describe("UserService", () => {
    const userService = new UserService();

    beforeEach(() => {
        handleMigrations();
    });

    it("should create a new user", async () => {
        const exec = async () => await userService.create({
            email: "create@gmail.com",
            password: "admin@1234"
        });

        expect(exec).not.toThrow();
    });
});