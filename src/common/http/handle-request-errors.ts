import { Response } from "express";
import { ZodError } from "zod";
import { HttpStatus } from "./http-status";
import {
    BadRequestException,
    ConflictException,
    NotFoundException,
    UnauthorizedException
} from "../exceptions";

export function handleRequestErros<T>(response: Response, error: T) {
    if (error instanceof ZodError) {
        const errors = error.errors.map(error => ({
            path: error.path.join("."),
            message: error.message
        }));

        const { message } = errors[0];
        const badRequestException = new BadRequestException(message);

        return response.status(badRequestException.statusCode).send({
            statusCode: badRequestException.statusCode,
            message: badRequestException.message
        });
    }

    if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
    ) {
        return response.status(error.statusCode).send({
            statusCode: error.statusCode,
            message: error.message
        });
    }

    return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: "Erro interno inesperado"
        });
}