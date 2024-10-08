import { HttpStatus } from "../http/http-status";

export class BadRequestException extends Error {
    constructor(
        message: string,
        readonly statusCode = HttpStatus.BAD_REQUEST
    ) {
        super(message);
    }
}