import { injectable } from "tsyringe";
import { AppDataSource } from "./typeorm-data-source";
import { TransactionEntity } from "./TransactionEntity";
import { Transaction } from "../../domain/entities/Transaction";
import { In, EntityManager, MoreThanOrEqual } from "typeorm";
import { TransactionRepositoryInterface } from "domain/repositories/TransactionRepositoryInterface";

@injectable()
export class TransactionRepositoryTypeORM implements TransactionRepositoryInterface {
    private repo = AppDataSource.getRepository(TransactionEntity);

    async saveOrUpdate(transaction: Transaction): Promise<void> {
        // Busca si existe por txid
        const existing = await this.repo.findOneBy({ txid: transaction.txid });
        if (existing) {
            // Actualiza campos excepto txid
            this.repo.merge(existing, {
                ...transaction,
                updated_at: new Date()
            });
            await this.repo.save(existing);
        } else {
            const entity = this.repo.create({
                ...transaction,
                updated_at: new Date()
            });
            await this.repo.save(entity);
        }
    }

    /**
     * Persiste o actualiza todas las transacciones en una sola transacción de base de datos,
     * optimizando para miles de registros y evitando múltiples conexiones.
     */
    async saveOrUpdateBulk(transactions: Transaction[]): Promise<void> {
        // Filtra duplicados por txid, dejando solo la última ocurrencia
        const uniqueMap = new Map<string, Transaction>();
        for (const tx of transactions) {
            uniqueMap.set(tx.txid, tx);
        }
        const uniqueTransactions = Array.from(uniqueMap.values());

        await AppDataSource.transaction(async (manager: EntityManager) => {
            // upsert: inserta o actualiza según txid
            await manager
                .createQueryBuilder()
                .insert()
                .into(TransactionEntity)
                .values(
                    uniqueTransactions.map(tx => ({
                        ...tx,
                        updated_at: new Date(),
                    }))
                )
                .orUpdate(
                    [
                        "address",
                        "amount",
                        "confirmations",
                        "lastblock",
                        "sourcefile",
                        "category",
                        "blockhash",
                        "blockindex",
                        "blocktime",
                        "vout",
                        "walletconflicts",
                        "time",
                        "timereceived",
                        "bip125_replaceable",
                        "involveswatchonly",
                        "account",
                        "label",
                        "updated_at"
                    ],
                    ["txid"]
                )
                .execute();
        });
    }

    async findByTxid(txid: string): Promise<TransactionEntity | null> {
        return await this.repo.findOneBy({ txid });
    }

    async findAll(): Promise<TransactionEntity[]> {
        return await this.repo.find();
    }

    async getValidDeposits(minConfirmations: number): Promise<TransactionEntity[]> {
        return await this.repo.find({
            where: {
                confirmations: MoreThanOrEqual(minConfirmations),
                category: 'receive'
            }
        });
    }
}