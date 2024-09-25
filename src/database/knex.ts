import { knex as knexClient } from "knex";
import { config } from "./config";

export const knex: knexClient.Knex = knexClient(config);
