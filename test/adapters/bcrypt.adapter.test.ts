import { describe, expect, it } from "vitest";
import { BcryptAdapter } from "../../src/adapters/bcrypt.adapter";

describe("bcrypt adapter", () => {
    const bcryptAdapter = new BcryptAdapter();
    const password = "test@1234";

    it("should create a hash based in a password provided", async () => {
        const passwordEncrypted = await bcryptAdapter.encrypt(password);
        expect(passwordEncrypted).not.toEqual(password);
    });

    it("should return true if password is valid", async () => {
        const passwordEncrypted = await bcryptAdapter.encrypt(password);
        const validPassword = await bcryptAdapter.compare(password, passwordEncrypted);

        expect(validPassword).toBeTruthy();
    });

    it("should return false if password is not valid", async () => {
        const passwordEncrypted = await bcryptAdapter.encrypt(password);
        const validPassword = await bcryptAdapter.compare("password", passwordEncrypted);

        expect(validPassword).toBeFalsy();
    });
});