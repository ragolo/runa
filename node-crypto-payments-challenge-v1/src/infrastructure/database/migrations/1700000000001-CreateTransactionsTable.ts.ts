import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransactionsTable1700000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                txid VARCHAR(100) PRIMARY KEY,
                address VARCHAR(100) NOT NULL,
                amount NUMERIC NOT NULL,
                confirmations INTEGER NOT NULL,
                lastblock VARCHAR(100),
                sourcefile VARCHAR(255),
                category VARCHAR(50),
                blockhash VARCHAR(100),
                blockindex INTEGER,
                blocktime BIGINT,
                vout INTEGER,
                walletconflicts JSONB,
                time BIGINT,
                timereceived BIGINT,
                bip125_replaceable VARCHAR(10),
                involveswatchonly BOOLEAN,
                account VARCHAR(100),
                label VARCHAR(100),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS transactions;`);
    }
}