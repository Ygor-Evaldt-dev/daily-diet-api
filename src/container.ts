import { Container } from "inversify";

import { UserService, UserController } from "./user";
import { BcryptAdapter } from "./adapters/bcrypt.adapter";
import { IEncrypter } from "./ports/encrypter.interface";

const container = new Container();

container.bind<IEncrypter>("IEncrypter")
    .to(BcryptAdapter)
    .inSingletonScope();

container.bind<UserService>(UserService)
    .to(UserService)
    .inSingletonScope();

container.bind<UserController>(UserController)
    .toDynamicValue((context) => {
        return new UserController(context.container.get(UserService));
    })
    .inSingletonScope();

export default container;
