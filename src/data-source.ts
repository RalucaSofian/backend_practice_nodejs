
/**
 * @file src/data-source.ts
 * @description Contains the typeorm DB Data Source
 */


import "reflect-metadata";
import { DataSource } from "typeorm";

import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./utils/constants";


/**
 * @description The typeorm Data Source
 */
export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: String(DB_PASSWORD),
    database: DB_NAME,
    synchronize: false,
    logging: false,
    entities: ["src/models/*.ts"],
    migrations: ["src/migrations/*.ts"],
    migrationsTableName: "migrations_list",
});
