import { DB } from '../db.interface.js';
import { JsonRpcProtocol } from '../protocol/json-rpc/json-rpc.protocol.js';
import { Protocol } from '../protocol/protocol.interface.js';

import { ProviderConfig } from '../provider/provider.config.interface.js';

import { ServiceConfig } from '../service/service-config.interface.js';
import { Transport } from '../transport/transport.interface.js';
//import { RuntimeApp } from './runtime-app.interface.js';

export interface RuntimeConfig {
  //transport: Transport;
  protocol: Protocol;

  providers: ProviderConfig[];

  services?: ServiceConfig[];

  db?: DB;
}
// export interface RuntimeConfig {
//   db: DB;
//   protocol: JsonRpcProtocol;
//   providers: ProviderConfig[];
//   services?: ServiceConfig[];
// }
// export interface RuntimeConfig {
//   db: DB;
//   transport: Transport;
//   protocol: JsonRpcProtocol; //todo:
//   providers: ProviderConfig[];
//   services?: ServiceConfig[];
// }
// export interface RuntimeConfig {
//   protocol: any;

//   providers: ProviderConfig[];

//   services?: ServiceConfig[];

//   db?: DB;
// }
