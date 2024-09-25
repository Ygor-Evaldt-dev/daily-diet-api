import { randomUUID } from "node:crypto";
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("user", (table) => {
        table.uuid("id").primary().defaultTo(randomUUID());
        table.string("email", 150).notNullable();
        table.string("password", 255).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("user");
}