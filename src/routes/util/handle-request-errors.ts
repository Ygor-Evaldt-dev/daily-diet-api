import { FastifyReply } from "fastify";
import { ZodError } from "zod";
import { HttpStatus } from "../../common/http-status";
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from "../../common/exceptions";

export function handleRequestErros<T>(reply: FastifyReply, error: T) {
    if (error instanceof ZodError) {
        const errors = error.errors.map(error => ({
            path: error.path.join("."),
            message: error.message
        }));

        const { message } = errors[0];
        const badRequestError = new BadRequestException(message);
        return reply.status(HttpStatus.BAD_REQUEST).send(badRequestError);
    }

    if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
    ) {
        return reply.status(error.statusCode).send(error);
    }

    return reply
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send("Erro interno inesperado");
}