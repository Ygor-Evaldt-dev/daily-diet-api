import { Container } from "inversify";

import { IEncrypter } from "../ports/encrypter.interface";

import { BcryptAdapter } from "../adapters";
import { UserService, UserController } from "../user";
import { MealService, MealController } from "../meal";
import { TYPES } from "./types";

const container = new Container();

container.bind<IEncrypter>(TYPES.IEncrypter)
    .to(BcryptAdapter)
    .inSingletonScope();

container.bind<UserService>(TYPES.UserService)
    .to(UserService)
    .inSingletonScope();

container.bind<UserController>(TYPES.UserController)
    .toDynamicValue((context) => {
        return new UserController(context.container.get(TYPES.UserService));
    })
    .inSingletonScope();

container.bind<MealService>(TYPES.MealService)
    .to(MealService)
    .inSingletonScope();

container.bind<MealController>(TYPES.MealController)
    .toDynamicValue((context) => {
        return new MealController(context.container.get(TYPES.MealService));
    })
    .inSingletonScope();

export default container;
