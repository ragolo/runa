import { Client } from 'pg';

export class PostgresConnection {
    private client!: Client;

    constructor(private connectionString?: string) {}

    async connect() {
        const connStr = this.connectionString || process.env.DATABASE_URL;
        if (!connStr) {
            console.error('[PostgresConnection] DATABASE_URL is not defined');
            throw new Error('DATABASE_URL is not defined');
        }
        console.log('[PostgresConnection] Connecting to PostgreSQL...');
        this.client = new Client({
            connectionString: connStr,
        });
        await this.client.connect();
        console.log('[PostgresConnection] Connected to PostgreSQL');
    }

    async disconnect() {
        if (this.client) {
            console.log('[PostgresConnection] Disconnecting from PostgreSQL...');
            await this.client.end();
            console.log('[PostgresConnection] Disconnected from PostgreSQL');
        }
    }

    getClient() {
        if (!this.client) {
            console.error('[PostgresConnection] Postgres client not connected');
            throw new Error('Postgres client not connected');
        }
        return this.client;
    }
}