import "reflect-metadata";
import { DataSource } from "typeorm";
import { TransactionEntity } from "./TransactionEntity";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [
        TransactionEntity
    ],
    migrations: [
        __dirname + "/migrations/*.{ts,js}"
    ],
    synchronize: false,
    logging: false,
});