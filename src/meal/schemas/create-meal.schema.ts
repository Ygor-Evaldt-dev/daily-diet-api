import { z } from "zod";

export const createMealSchema = z.object({
    name: z.coerce
        .string()
        .min(2, "O nome da refeição deve ter no mínimo 2 caracteres")
        .max(100, "O nome da refeição deve ter no máximo 100 caracteres"),
    description: z.coerce.string(),
    isOnDiet: z.coerce.boolean(),
    createdAt: z.coerce.string().datetime(),
    userId: z.coerce.string()
});