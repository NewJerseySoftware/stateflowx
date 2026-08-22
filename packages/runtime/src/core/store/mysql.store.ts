import {
    createPool,
    Pool,
    ResultSetHeader,
    RowDataPacket,
} from 'mysql2/promise';

import { Store } from './store-interface.js';

import {
    MySqlStoreConfig,
} from './store-config.interface.js';

interface StoreRow extends RowDataPacket {
    store_value: unknown;
}

export class MySqlStore implements Store {

    readonly type = 'mysql' as const;

    private readonly pool: Pool;

    private readonly table: string;

    constructor(
        config: MySqlStoreConfig
    ) {
        this.table =
            config.table ?? 'stateflow_store';

        this.validateTableName(this.table);

        this.pool = createPool({
            host: config.host,
            port: config.port ?? 3306,
            database: config.database,
            user: config.user,
            password: config.password,
            waitForConnections: true,
            connectionLimit:
                config.connectionLimit ?? 10,
            queueLimit: 0,
        });
    }

    async initialize(): Promise<void> {
        await this.pool.execute(`
      CREATE TABLE IF NOT EXISTS \`${this.table}\` (
        store_key VARCHAR(255) NOT NULL,
        store_value JSON NOT NULL,
        created_at TIMESTAMP NOT NULL
          DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL
          DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (store_key)
      )
    `);
    }

    async get<T = unknown>(
        key: string
    ): Promise<T | undefined> {
        const [rows] =
            await this.pool.execute<StoreRow[]>(
                `
          SELECT store_value
          FROM \`${this.table}\`
          WHERE store_key = ?
          LIMIT 1
        `,
                [key]
            );

        if (rows.length === 0) {
            return undefined;
        }

        const value = rows[0].store_value;

        if (typeof value === 'string') {
            return JSON.parse(value) as T;
        }

        return value as T;
    }

    async set<T = unknown>(
        key: string,
        value: T
    ): Promise<void> {
        const serializedValue =
            JSON.stringify(value);

        if (serializedValue === undefined) {
            throw new Error(
                `Cannot store undefined value for key "${key}"`
            );
        }

        await this.pool.execute<ResultSetHeader>(
            `
        INSERT INTO \`${this.table}\`
          (store_key, store_value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
          store_value = VALUES(store_value)
      `,
            [
                key,
                serializedValue,
            ]
        );
    }

    async has(
        key: string
    ): Promise<boolean> {
        const [rows] =
            await this.pool.execute<RowDataPacket[]>(
                `
          SELECT 1
          FROM \`${this.table}\`
          WHERE store_key = ?
          LIMIT 1
        `,
                [key]
            );

        return rows.length > 0;
    }

    async delete(
        key: string
    ): Promise<void> {
        await this.pool.execute(
            `
        DELETE FROM \`${this.table}\`
        WHERE store_key = ?
      `,
            [key]
        );
    }

    async clear(): Promise<void> {
        await this.pool.execute(
            `DELETE FROM \`${this.table}\``
        );
    }

    async close(): Promise<void> {
        await this.pool.end();
    }

    private validateTableName(
        table: string
    ): void {
        if (!/^[a-zA-Z0-9_]+$/.test(table)) {
            throw new Error(
                `Invalid MySQL store table name: "${table}"`
            );
        }
    }


    async insert<T = unknown>(
        key: string,
        value: T
    ): Promise<void> {
        const existing =
            await this.get<unknown>(key);

        if (existing === undefined) {
            await this.set(
                key,
                [value]
            );

            return;
        }

        if (Array.isArray(existing)) {
            existing.push(value);

            await this.set(
                key,
                existing
            );

            return;
        }

        await this.set(
            key,
            [
                existing,
                value,
            ]
        );
    }
}