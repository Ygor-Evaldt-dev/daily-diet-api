import { describe, it, expect, beforeEach } from "vitest";
import { UserService } from "../../src/user/user.service";
import { handleMigrations } from "../utils/handle-migrations";
import { TYPES } from "../../src/container-manegment/types";
import container from "../../src/container-manegment/container";

describe("user service", () => {
    const userService = container.get<UserService>(TYPES.UserService);

    const createUserDto = {
        email: "create@gmail.com",
        password: "admin@1234"
    };

    beforeEach(() => {
        handleMigrations();
    });

    describe("create", () => {
        it("should create a new user", async () => {
            const exec = async () => await userService.create(createUserDto);
            await expect(exec()).resolves.not.toThrow();
        });

        it("should throw conflict exception if user alredy registered", async () => {
            await userService.create(createUserDto);

            const exec = async () => await userService.create(createUserDto);

            expect(exec).rejects.toThrow();
        });
    });

    describe("find unique", () => {
        it("should to find unique user", async () => {
            await userService.create(createUserDto);

            const { user } = await userService.findUnique({ email: createUserDto.email });

            expect(user.email).toEqual(createUserDto.email);
        });

        it("should throw not found exception if an especific user is not registered", async () => {
            const exec = async () => await userService.findUnique({ email: createUserDto.email });
            expect(exec).rejects.toThrow();
        });
    });

    describe("update", () => {
        it("should update an user alredy registres", async () => {
            await userService.create(createUserDto);
            const { user } = await userService.findUnique({ email: createUserDto.email });

            const updateUserDto = {
                email: "update@gmail.com",
                password: "other@password"
            };
            const exec = async () => await userService.update(user.id, updateUserDto);

            await expect(exec()).resolves.not.toThrow();
        });

        it("should throw not found exception if user is not alread registered", async () => {
            const updateUserDto = {
                email: "update@gmail.com",
                password: "other@password"
            };
            const exec = async () => await userService.update("fake-uuid", updateUserDto);

            expect(exec).rejects.toThrow();
        });

        it("should throw conflict exception if user with same e-mail already registered", async () => {
            await userService.create(createUserDto);
            const { user } = await userService.findUnique({ email: createUserDto.email });

            const updateUserDto = { ...createUserDto };
            const exec = async () => await userService.update(user.id, updateUserDto);

            expect(exec).rejects.toThrow();
        });
    });
});