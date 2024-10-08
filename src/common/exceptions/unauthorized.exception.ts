import { HttpStatus } from "../http/http-status";

export class UnauthorizedException extends Error {
    constructor(
        message: string,
        readonly statusCode = HttpStatus.UNAUTHORIZED
    ) {
        super(message);
    }
}