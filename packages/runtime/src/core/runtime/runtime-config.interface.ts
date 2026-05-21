import { DB } from '../db.interface.js';
import { Protocol } from '../protocol/protocol.interface.js';
import { ProviderConfig } from '../provider/provider.config.interface.js';
import { ServiceConfig } from '../service/service-config.interface.js';

export interface RuntimeConfig {

  protocol: Protocol;

  providers: ProviderConfig[];

  services?: ServiceConfig[];

  db?: DB;
}