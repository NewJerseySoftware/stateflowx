import { DB } from '../../core/db.interface';

export class InMemoryDB implements DB {
  private store = new Map<string, any>();

  constructor(private namespace: string = 'default') {}

  private buildKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  get<T = any>(key: string): T | undefined {
    return this.store.get(this.buildKey(key));
  }

  set<T = any>(key: string, value: T): void {
    this.store.set(this.buildKey(key), value);
  }

  delete(key: string): void {
    this.store.delete(this.buildKey(key));
  }

  clear(): void {
    const prefix = `${this.namespace}:`;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }
}