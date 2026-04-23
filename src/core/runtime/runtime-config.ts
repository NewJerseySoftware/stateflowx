import { DB } from "../db.interface";
import { Adapter } from "./adapter.interface";

export interface RuntimeConfig {
  adapters: Adapter[];
  db?: DB;
  transport?: {
    jsonrpc?: any;
    http?: any;
    ai?: any;
  };
}