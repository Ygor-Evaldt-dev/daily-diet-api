import { z } from "zod";

export const findManyMealSchema = z.object({
    page: z.coerce.number(),
    take: z.coerce.number()
});