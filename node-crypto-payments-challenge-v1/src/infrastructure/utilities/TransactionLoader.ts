import fs from 'fs/promises';
import path from 'path';
import { Transaction } from '../../domain/entities/Transaction';

export class TransactionLoader {
    /**
     * Loads all transactions from JSON files matching the given pattern in the specified directory.
     * Supports both array at root and { transactions: [...] } structures.
     * @param dir Directory where to look for transaction files.
     * @param pattern Glob-like pattern for file names, default is 'transactions-*.json'.
     * @throws Error if no files are found or if any file cannot be read/parsed.
     */
    static async loadTransactions(
        dir: string = path.resolve(__dirname, '../files'),
        pattern: string = process.env.TRANSACTION_FILE_PATTERN || 'transactions-*.json'
    ): Promise<Transaction[]> {
        // Validate directory existence
        try {
            await fs.access(dir);
        } catch {
            throw new Error(`[TransactionLoader] Directory not found: ${dir}`);
        }

        // List files matching the pattern
        const allFiles = await fs.readdir(dir);
        const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
        const matchedFiles = allFiles.filter(f => regex.test(f));

        if (matchedFiles.length === 0) {
            throw new Error(`[TransactionLoader] No files found matching pattern "${pattern}" in directory "${dir}"`);
        }

        let transactions: Transaction[] = [];
        for (const file of matchedFiles) {
            const filePath = path.join(dir, file);
            try {
                const data = await fs.readFile(filePath, 'utf-8');
                const parsed = JSON.parse(data);

                if (!parsed || !Array.isArray(parsed.transactions) || !parsed.lastblock) {
                    throw new Error(`[TransactionLoader] File ${file} does not contain a valid 'transactions' array or 'lastblock'`);
                }

                const lastblock = parsed.lastblock;
                const sourcefile = file;
                const txs = parsed.transactions.map((tx: any) => ({
                    ...tx,
                    lastblock,
                    sourcefile
                }));

                transactions = transactions.concat(txs);
            } catch (err) {
                throw new Error(`[TransactionLoader] Error reading or parsing file: ${filePath} - ${(err as Error).message}`);
            }
        }
        // Regla de negocio: Debe haber al menos una transacción válida
        if (transactions.length === 0) {
            throw new Error('[TransactionLoader] No transactions found in the provided files');
        }
        return transactions;
    }
}