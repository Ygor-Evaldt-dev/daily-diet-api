import fastify from "fastify";
import cookie from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";

import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

import { userRoutes } from "./routes/user";
import { UserService } from "./user/user.service";
import { BcryptAdapter } from "./adapters/bcrypt.adapter";

export const app = fastify();

const bcryptAdapter = new BcryptAdapter();
const userService = new UserService(bcryptAdapter);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cookie);
app.register(fastifyCors, {
    origin: "*"
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(userRoutes, { prefix: "/user", userService });
