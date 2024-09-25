import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("meal", (table) => {
        table.boolean("is_on_diet").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("meal", (table) => {
        table.dropColumn("is_on_diet");
    });
}

