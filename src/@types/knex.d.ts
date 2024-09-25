//eslint-disable-next-line
import { Knex } from "knes";

declare module "knex/types/tables" {
    export interface Tables {
        user: {
            id: string;
            email: string;
            password: string;
        }
    }
}