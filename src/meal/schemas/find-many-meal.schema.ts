import { z } from "zod";

export const findManyMealSchema = z.object({
    userId: z.string(),
    page: z.coerce.number(),
    take: z.coerce.number()
});