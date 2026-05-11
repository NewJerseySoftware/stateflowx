import { DB }
from '../db.interface';

import { Adapter }
from './adapter.interface';

import { ProviderManager }
from '../provider/provider.manager';

export interface RuntimeConfig {

  providers:
    ProviderManager;

  adapters:
    Adapter[];

  db?: DB;

  transport?: {

    jsonrpc?: any;

    http?: any;
  };
}
// import { DB } from "../db.interface";
// import { Adapter } from "./adapter.interface";
// import { ProviderManager } from "../provider/provider.manager";

// export interface RuntimeConfig {
//   providers: ProviderManager;
//   adapters: Adapter[];
//   db?: DB;
//   transport?: {
//     jsonrpc?: any;
//     http?: any;
//     ai?: any;
//   };
// }