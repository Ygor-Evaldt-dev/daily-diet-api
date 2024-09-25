import { execSync } from "node:child_process";

export function handleMigrations() {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
}