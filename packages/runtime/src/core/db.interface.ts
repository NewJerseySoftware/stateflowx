export interface DB {
  get<T = unknown>(key: string): T | undefined;

  set<T = unknown>(key: string, value: T): void;

  delete(key: string): void;

  clear(): void;
}
