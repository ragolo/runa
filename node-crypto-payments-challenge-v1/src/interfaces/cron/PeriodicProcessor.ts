import { DepositService } from "../../application/services/DepositService";
import { TransactionService } from "../../application/services/TransactionService";
import { TransactionRepositoryInterface } from "../../domain/repositories/TransactionRepositoryInterface";
import cron, { ScheduledTask } from "node-cron";
import { container } from "tsyringe"; // <-- Importa el contenedor de tsyringe

export class PeriodicProcessor {
    private task?: ScheduledTask;
    private transactionService: TransactionService;
    private depositService: DepositService;

    constructor(
        private cronExpression: string = process.env.CRON_EXPRESSION || "*/1 * * * *" // usa variable de entorno o cada minuto por defecto
    ) {
        if (!this.cronExpression) {
            throw new Error("Cron expression is required");
        }
        console.log(`[PeriodicProcessor] Cron expression: "${this.cronExpression}"`);   

        // Inyección de dependencias usando tsyringe
        this.transactionService = container.resolve(TransactionService);

        // Obtén el repositorio desde el contenedor o desde el servicio
        const transactionRepository: TransactionRepositoryInterface = container.resolve("TransactionRepository");
        this.depositService = new DepositService(transactionRepository);
    }

    start() {
        console.log(`[PeriodicProcessor] Starting periodic processing with cron: "${this.cronExpression}"`);
        this.task = cron.schedule(this.cronExpression, async () => {
            try {
                console.log("[PeriodicProcessor] Processing deposits from files...");
                await this.transactionService.loadTransactions();
                await this.depositService.printDepositSummary(); // <-- Imprime el resumen en stdout
                console.log("[PeriodicProcessor] Processing complete.");
            } catch (err) {
                console.error("[PeriodicProcessor] Error during processing:", err);
            }
        });
        this.task.start();
    }

    stop() {
        if (this.task) {
            this.task.stop();
            console.log("[PeriodicProcessor] Stopped periodic processing.");
        }
    }
}