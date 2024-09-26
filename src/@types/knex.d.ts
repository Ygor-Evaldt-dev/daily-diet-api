//eslint-disable-next-line
import { Knex } from "knes";

declare module "knex/types/tables" {
    export interface User {
        id: string;
        email: string;
        password: string;
    }

    export interface Meal {
        id: string;
        name: string;
        description: string;
        is_on_diet: boolean;
        created_at: Date;
        user_id: string;
    }

    export interface Tables {
        user: User,
        meal: Meal
    }
}