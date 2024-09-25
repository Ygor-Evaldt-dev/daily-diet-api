import { Knex } from "knex";
import { env } from "../env";

const { DATABASE_CLIENT, DATABASE_URL } = env;

const sqLiteConnection = {
    filename: DATABASE_URL
};

export const config: Knex.Config = {
    client: DATABASE_CLIENT,
    connection: DATABASE_CLIENT === "sqlite" ? sqLiteConnection : DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: "./temp-database/migrations"
    }
};
