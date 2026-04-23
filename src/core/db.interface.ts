export interface DB {
  get<T = any>(key: string): T | undefined;
  set<T = any>(key: string, value: T): void;
  delete(key: string): void;
  clear(): void;
}