import { injectable, inject } from "tsyringe";
import { TransactionRepositoryInterface } from "../../domain/repositories/TransactionRepositoryInterface";
import { DepositCalculator, CustomerDepositsCalculator, SmallestDepositCalculator, LargestDepositCalculator, WithoutReferenceCalculator } from "./DepositCalculatorsStrategy";
import path from "path";
import fs from "fs";
import { plainToInstance } from "class-transformer";
import { Transaction } from "../../domain/entities/Transaction";

function loadCustomerAddresses(): Record<string, string> {
    const configPath = path.resolve(__dirname, '../../config/customer-addresses.json');
    if (!fs.existsSync(configPath)) {
        throw new Error(`[DepositService] Customer addresses config not found at ${configPath}`);
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

function getMinConfirmations(): number {
    const envValue = process.env.MIN_CONFIRMATIONS;
    const parsed = envValue ? parseInt(envValue, 10) : NaN;
    if (!isNaN(parsed) && parsed > 0) return parsed;
    return 6; // default
}

function toTransactionArray(entities: any[]): Transaction[] {
    return plainToInstance(Transaction, entities, { excludeExtraneousValues: false });
}

@injectable()
export class DepositService {
    private customerAddresses: Record<string, string>;
    private calculators: DepositCalculator[];

    constructor(
        @inject("TransactionRepository") private transactionRepository: TransactionRepositoryInterface
    ) {
        this.customerAddresses = loadCustomerAddresses();
        this.calculators = [
            new CustomerDepositsCalculator(),
            new WithoutReferenceCalculator(),
            new SmallestDepositCalculator(),
            new LargestDepositCalculator()
        ];
    }

    // Si necesitas sobreescribir customerAddresses o calculators, usa setters:
    public setCustomerAddresses(addresses: Record<string, string>) {
        this.customerAddresses = addresses;
    }

    public setCalculators(calculators: DepositCalculator[]) {
        this.calculators = calculators;
    }

    public async getDepositSummary(): Promise<Record<string, string>> {
        const allDepositsRaw = await this.transactionRepository.getValidDeposits(getMinConfirmations());
        const allDeposits = toTransactionArray(allDepositsRaw);
        if (allDeposits.length === 0) {
            return { "No valid deposits found": "0" };
        }
        return this.calculateSummary(allDeposits);
    }

    private calculateSummary(deposits: Transaction[]): Record<string, string> {
        return this.calculators.reduce((acc, calculator) => {
            return { ...acc, ...calculator.calculate(deposits, this.customerAddresses) };
        }, {});
    }

    public async printDepositSummary(): Promise<void> {
        const summary = await this.getDepositSummary();
        Object.entries(summary).forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
        });
    }
}