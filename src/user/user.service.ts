import { randomUUID } from "node:crypto";

import { knex } from "../database";
import { IEncrypter } from "../ports/encrypter.interface";
import { CreateUserDto, FindUniqueUserDto, UpdateUserDto } from "./dtos";
import { ConflictException } from "../common/exceptions/conflict.exception";
import { NotFoundException } from "../common/exceptions/not-found.exception";

export class UserService {
    constructor(
        private readonly encrypter: IEncrypter
    ) { }

    public async create({ email, password }: CreateUserDto) {
        const [userAlreadRegistered] = await knex("user").where({ email });
        if (userAlreadRegistered) {
            throw new ConflictException("Usuário já cadastrado");
        }

        const encryptedPassword = await this.encrypter.encrypt(password);

        await knex("user").insert({
            id: randomUUID(),
            email,
            password: encryptedPassword
        });
    }

    public async findUnique({ id, email }: FindUniqueUserDto) {
        const queryCondition: FindUniqueUserDto = {};

        if (id) queryCondition.id = id;
        if (email) queryCondition.email = email;

        const user = await knex("user").where(queryCondition).first();
        if (!user || (!id && !email)) {
            throw new NotFoundException("Usuário não cadastrado");
        }

        return { user };
    }

    public async update(id: string, { email, password }: UpdateUserDto) {
        const { user } = await this.findUnique({ id });

        const userWithSameEmail = email ? await knex("user").where({ email }).first() : undefined;
        if (userWithSameEmail) {
            throw new ConflictException("Usuário já cadastrado");
        }

        const passwordEncrypted = password ? await this.encrypter.encrypt(password) : user.password;

        await knex("user").where({ id }).update({
            email: email || user.email,
            password: passwordEncrypted
        });
    }
}