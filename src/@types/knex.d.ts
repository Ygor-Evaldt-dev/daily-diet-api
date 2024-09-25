//eslint-disable-next-line
import { Knex } from "knes";

declare module "knex/types/tables" {
    export interface Tables {
        user: {
            id: string;
            email: string;
            password: string;
        },
        meal: {
            id: string;
            name: string;
            description: string;
            created_at: Date;
            user_id: string;
        }
    }
}