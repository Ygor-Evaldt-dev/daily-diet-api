import { knex } from "../database";
import { CreateUserDto } from "./dto";

export class UserService {
    public async create(data: CreateUserDto) {
        await knex("user").insert(data);
    }
}