import {
  StoreType,
} from '@stateflowx/common';

export interface Store {
  readonly type: StoreType;

  get<T = unknown>(
    key: string
  ): Promise<T | undefined>;

  set<T = unknown>(
    key: string,
    value: T
  ): Promise<void>;

  has(key: string): Promise<boolean>;

  delete(key: string): Promise<void>;

  clear(): Promise<void>;

  close?(): Promise<void>;
}