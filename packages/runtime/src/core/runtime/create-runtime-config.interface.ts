import { DB } from '../db.interface.js';

import { ProviderConfig } from '../provider/provider.config.interface.js';
import { ServiceConfig } from '../service/service-config.interface.js';
import { Transport } from '../transport/transport.interface.js';
import { Protocol } from '../protocol/protocol.interface.js';

export interface CreateRuntimeConfig {
  transport: Transport;
  protocol: Protocol;
  providers: ProviderConfig[];
  services?: ServiceConfig[];
  db?: DB;
}
