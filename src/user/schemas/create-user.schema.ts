import { z } from "zod";

export const createUserSchema = z.object({
    email: z
        .string()
        .email("E-mail deve ser válido"),
    password: z
        .string()
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .max(16, "A senha deve ter no máximo 16 caracteres")
});