import { randomUUID } from "node:crypto";

import { knex } from "../database";
import { IEncrypter } from "../ports/encrypter.interface";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { ConflictException } from "../common/exceptions/conflict.exception";
import { NotFoundException } from "../common/exceptions/not-found.exception";

export class UserService {
    constructor(
        private readonly encrypter: IEncrypter
    ) { }

    public async create({ email, password }: CreateUserDto) {
        const [userAlreadRegistred] = await knex("user").where({ email });
        if (userAlreadRegistred) {
            throw new ConflictException("Usuário já cadastrado");
        }

        const encryptedPassword = await this.encrypter.encrypt(password);

        await knex("user").insert({
            id: randomUUID(),
            email,
            password: encryptedPassword
        });
    }

    public async findUnique(email: string) {
        const [user] = await knex("user").where({ email });
        if (!user) {
            throw new NotFoundException("Usuário não cadastrado");
        }

        return { user };
    }

    public async update(id: string, { email, password }: UpdateUserDto) {
        const [user] = await knex("user").where({ id });
        if (!user) {
            throw new NotFoundException("Usuário não cadastrado");
        }

        const [userWithSameEmail] = email ? await knex("user").where({ email }) : [undefined];
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