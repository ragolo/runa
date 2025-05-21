import { TransactionLoader } from '../../infrastructure/utilities/TransactionLoader';
import { TransactionRepositoryTypeORM } from "../../infrastructure/database/TransactionRepositoryTypeORM";
import { Transaction } from "../../domain/entities/Transaction";


export class TransactionService {
    private transactionRepository: TransactionRepositoryTypeORM;

    constructor(
    ) {
        this.transactionRepository = new TransactionRepositoryTypeORM();
    }

    /**
     * Carga las transacciones desde los archivos y las persiste en la base de datos en bloques de 100.
     * Cada transacción se inserta o actualiza según su txid.
     * Retorna los depósitos generados para lógica de negocio.
     */
    public async loadTransactions(){
        const transactions: Transaction[] = await TransactionLoader.loadTransactions();
        await this.transactionRepository.saveOrUpdateBulk(transactions);
    }
}