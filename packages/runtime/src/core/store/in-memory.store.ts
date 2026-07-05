export interface Store {

  get<T = unknown>(key: string): T | undefined;

  set<T = unknown>(key: string, value: T): void;

  has(key: string): boolean;

  delete(key: string): void;

  clear(): void;
}
