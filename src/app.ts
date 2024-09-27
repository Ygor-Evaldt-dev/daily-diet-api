import fastify from "fastify";
import cookie from "@fastify/cookie";

export const app = fastify();

app.get("/", () => {
    return "hello world";
});

app.register(cookie);
