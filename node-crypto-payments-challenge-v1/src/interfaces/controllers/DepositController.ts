import { TransactionService } from "../../application/services/TransactionService";
import { DepositService } from "../../application/services/DepositService";
import { Request, Response } from "express";
import { container } from "tsyringe";

// Declare AggregateError as a global variable for TypeScript
declare const AggregateError: {
    new(errors: any[], message?: string): Error;
    prototype: Error;
};

export class DepositController {
    private depositService: DepositService;
    private transactionService: TransactionService;

    constructor() {
        // Inyección de dependencias usando tsyringe
        this.depositService = container.resolve(DepositService);
        this.transactionService = container.resolve(TransactionService);
    }

    private getErrorMessage(error: any): string {
        const AggregateErrorRef = typeof AggregateError !== "undefined" ? AggregateError : undefined;
        if (
            AggregateErrorRef &&
            error instanceof AggregateErrorRef &&
            Array.isArray((error as any)?.errors)
        ) {
            return (error as any).errors.map((e: any) => e?.message || e?.toString()).join(" | ");
        }
        return error?.message || error?.toString() || "Unknown error";
    }

    public async processDeposits(req: Request, res: Response): Promise<Response> {
        try {
            await this.transactionService.loadTransactions();
            return res.status(200).json({ message: "Deposits processed successfully" });
        } catch (error: any) {
            const message = this.getErrorMessage(error);
            return res.status(500).json({ message });
        }
    }

    public async getDepositSummary(req: Request, res: Response): Promise<Response> {
        try {
            const summary = await this.depositService.getDepositSummary();
            return res.status(200).json(summary);
        } catch (error: any) {
            const message = this.getErrorMessage(error);
            return res.status(500).json({ message });
        }
    }
}