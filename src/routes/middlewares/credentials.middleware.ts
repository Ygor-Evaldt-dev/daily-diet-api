import { Request, Response, NextFunction } from "express";

import container from "../../container-manegment/container";
import { TYPES } from "../../container-manegment/types";
import { IEncrypter } from "../../ports/encrypter.interface";
import { UserService } from "../../user";
import { handleRequestErrors } from "../../common/http/handle-request-errors";
import { UnauthorizedException } from "../../common/exceptions";

export async function credentialsMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userService = container.get<UserService>(TYPES.UserService);
        const encrypter = container.get<IEncrypter>(TYPES.IEncrypter);

        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            throw new UnauthorizedException("Authorization header is missing");
        }

        const base64Credentials = authHeader.split(" ")[1];
        const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
        const [username, password] = credentials.split(":");

        const { user } = await userService.findUnique({ email: username });

        const isValidPassword = await encrypter.compare(password, user.password);
        if (!isValidPassword)
            throw new UnauthorizedException("Unauthorized");

        Object.assign(req, { user });

        next();
    } catch (error) {
        handleRequestErrors(res, error);
    }
}