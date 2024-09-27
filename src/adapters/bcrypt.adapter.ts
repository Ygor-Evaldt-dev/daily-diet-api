import { injectable } from "inversify";
import { hash, compare } from "bcrypt";

import { IEncrypter } from "../ports/encrypter.interface";

@injectable()
export class BcryptAdapter implements IEncrypter {
    private readonly saltRounds: number = 12;

    async encrypt(password: string): Promise<string> {
        return await hash(password, this.saltRounds);
    }
    async compare(password: string, hash: string): Promise<boolean> {
        return await compare(password, hash);
    }
}