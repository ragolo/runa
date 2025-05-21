import { Deposit } from '../entities/Deposit';

export interface DepositRepositoryInterface {
    save(deposit: Deposit): Promise<void>;
    findValidDeposits(): Promise<Deposit[]>;
    findDepositsByAddress(address: string): Promise<Deposit[]>;
    findAllDeposits(): Promise<Deposit[]>;
}