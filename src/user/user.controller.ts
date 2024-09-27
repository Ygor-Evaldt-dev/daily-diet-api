import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { UserService } from "./user.service";
import { createUserSchema, updateUserSchema } from "./schemas";

import { HttpStatus } from "../common/http/http-status";
import { handleRequestErros } from "../common/http/handle-request-errors";

@injectable()
export class UserController {
    constructor(
        @inject("UserService")
        private readonly userService: UserService
    ) { }

    public async create(req: Request, res: Response) {
        try {
            const body = createUserSchema.parse(req.body);
            await this.userService.create(body);

            res.sendStatus(HttpStatus.CREATED);
        } catch (error) {
            handleRequestErros<typeof error>(res, error);
        }
    }

    public async findUnique(req: Request, res: Response) {
        try {
            const response = await this.userService.findUnique({
                email: req.params.email
            });

            const user = Object.assign(response.user, { password: undefined });

            res.status(HttpStatus.OK).send({ user });
        } catch (error) {
            handleRequestErros<typeof error>(res, error);
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { email, password } = updateUserSchema.parse(req.body);

            await this.userService.update(id, {
                email: email ?? undefined,
                password: password ?? undefined
            });

            res.sendStatus(HttpStatus.OK);
        } catch (error) {
            handleRequestErros<typeof error>(res, error);
        }
    }

}