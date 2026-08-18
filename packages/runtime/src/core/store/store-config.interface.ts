export interface InMemoryStoreConfig {
    type: 'memory';
}

export interface MySqlStoreConfig {
    type: 'mysql';

    host: string;

    port?: number;

    database: string;

    user: string;

    password: string;

    table?: string;

    connectionLimit?: number;
}

export type StoreConfig =
    | InMemoryStoreConfig
    | MySqlStoreConfig;