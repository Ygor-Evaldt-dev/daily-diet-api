import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        env: {
            NODE_ENV: "test",
            DATABASE_URL: "./temp-database/test.db",
            DATABASE_CLIENT: "sqlite",
            PORT: "3333",
        },
        fileParallelism: false,
        setupFiles: "./setup-test.ts"
    },
});