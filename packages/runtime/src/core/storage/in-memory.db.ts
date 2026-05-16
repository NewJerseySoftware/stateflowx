import { DB } from '../db.interface.js';

export class InMemoryDB implements DB {
  private store = new Map<string, any>();

  get<T = any>(key: string): T | undefined {
    return this.store.get(key);
  }

  set<T = any>(key: string, value: T): void {
    this.store.set(key, value);
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}
