import { z } from "zod";

export const updateMealSchema = z.object({
    name: z
        .string({
            required_error: "'name' is required",
            invalid_type_error: "'name' deve ser uma string"
        })
        .trim()
        .toLowerCase()
        .min(2, "'name' should have a minimum of 2 characters")
        .max(100, "'name' should have a maximun of 100 characters")
        .optional(),
    description: z
        .string({
            required_error: "'description is required'",
            invalid_type_error: "'description' deve ser uma string"
        })
        .trim()
        .toLowerCase()
        .min(10, "'description' should have a minimum of 10 characters")
        .max(250, "'description' should have a maximun of 250 characters")
        .optional(),
    isOnDiet: z
        .boolean({
            required_error: "'isOnDiet' is required",
            invalid_type_error: "'isOnDiet' should be a boolean value"
        })
        .optional(),
    createdAt: z.coerce
        .string({
            required_error: "'createdAt' is required",
            invalid_type_error: "'createdAt' should be a string"
        })
        .datetime({ message: "createdAt should be a valid date" })
        .optional(),
    userId: z
        .string({ message: "'userId' is required" })
        .trim()
});