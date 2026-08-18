import { StoreConfig } from './store-config.interface.js';

import { Store } from './store-interface.js';

import { InMemoryStore } from './in-memory.store.js';

import { MySqlStore } from './mysql.store.js';

export class StoreFactory {
  static async create(
    config?: StoreConfig | false
  ): Promise<Store | undefined> {
    if (config === false) {
      return undefined;
    }

    if (!config || config.type === 'memory') {
      return new InMemoryStore();
    }

    if (config.type === 'mysql') {
      const store =
        new MySqlStore(config);

      await store.initialize();

      return store;
    }

    throw new Error(
      'Unsupported store configuration'
    );
  }
}