import { FastifyInstance, FastifyPluginOptions } from "fastify";

import { HttpStatus } from "../../common/http-status";
import { UserService } from "../../user/user.service";
import { createUserSchema } from "./schemas";
import { handleRequestErros } from "../util/handle-request-errors";

interface UserRoutesOptions extends FastifyPluginOptions {
    userService: UserService;
}

export async function userRoutes(app: FastifyInstance, options: UserRoutesOptions) {
    app.post("/", async (request, reply) => {
        try {
            const userService = options.userService;
            const body = createUserSchema.parse(request.body);

            await userService.create({ ...body });

            reply.status(HttpStatus.CREATED).send();
        } catch (error) {
            handleRequestErros<typeof error>(reply, error);
        }
    });
}