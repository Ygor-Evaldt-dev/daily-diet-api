import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
    DATABASE_CLIENT: z.enum(["sqlite", "pg"]),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333)
});
const envValidation = envSchema.safeParse(process.env);

if (!envValidation.success) {
    console.error("Invalid enviroment variables", envValidation.error.format());
    throw new Error("Invalid enviroment variables");
}

export const env = envValidation.data;