import { HttpStatus } from "../http-status";

export class ConflictException extends Error {
    constructor(
        message: string,
        readonly statusCode = HttpStatus.CONFLICT
    ) {
        super(message);
    }
}