import { TransactionEntity } from 'infrastructure/database/TransactionEntity';
import { Transaction } from '../entities/Transaction';

export interface TransactionRepositoryInterface {
  
  
  /**
   * Persists or updates a single transaction in the database.
   * @param transaction The Transaction object to be saved or updated.
   */
  saveOrUpdate(transaction: Transaction): Promise<void>;
  
  /**
   * Persists or updates multiple transactions in a single database transaction,
   * optimizing for thousands of records and avoiding multiple connections.
   * @param transactions An array of Transaction objects to be saved or updated.
   */
  saveOrUpdateBulk(transactions: Transaction[]): Promise<void>;
  
  /**
   * Retrieves a transaction by its unique identifier (txid).
   * @param txid The unique identifier of the transaction.
   * @returns A promise that resolves to the TransactionEntity object if found, or null if not found.
   */
  findByTxid(txid: string): Promise<TransactionEntity | null>;
  
  /**
   * Retrieves all transactions from the repository.
   * @returns A promise that resolves to an array of TransactionEntity objects.
   */
  findAll(): Promise<TransactionEntity[]>;

  /**
   * Retrieves all transactions with confirmations greater than or equal to the specified minimum.
   * @param minConfirmations The minimum number of confirmations required.
   * @returns A promise that resolves to an array of TransactionEntity objects.
   */
  getValidDeposits(minConfirmations: number): Promise<TransactionEntity[]>;

}