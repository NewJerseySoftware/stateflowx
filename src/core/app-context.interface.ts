import { DB } from './db.interface';

export interface AppContext {
  db: DB;
  state: Record<string, any>;
  transport?: {
    jsonrpc?: any;
    http?: any;
    ai?: any;
  };
}