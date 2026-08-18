import { Store } from "./store-interface.js";


export class InMemoryStore implements Store {
  readonly type = 'memory' as const;

  private readonly store =
    new Map<string, unknown>();

  async get<T = unknown>(
    key: string
  ): Promise<T | undefined> {
    return this.store.get(key) as
      | T
      | undefined;
  }

  async set<T = unknown>(
    key: string,
    value: T
  ): Promise<void> {
    this.store.set(key, value);
  }

  async has(
    key: string
  ): Promise<boolean> {
    return this.store.has(key);
  }

  async delete(
    key: string
  ): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}
