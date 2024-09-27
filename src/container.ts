import { Container } from "inversify";
import { UserService } from "./user/user.service";
import { UserController } from "./user/user.controller";
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
