import { AgentConfig } from '@stateflowx/common';
import { DB } from '../db.interface.js';
import { RuntimeEventBus } from '../events/runtime-event-bus.js';
import { Protocol } from '../protocol/protocol.interface.js';
import { ProviderConfig } from '../provider/provider.config.interface.js';
import { ServiceConfig } from '../service/service-config.interface.js';
import { Transport } from '../transport/transport.interface.js';

export interface RuntimeOptions {
  apiKey: string;

  transport: Transport;

  protocol: Protocol;

  agents?: AgentConfig[];

  providers: ProviderConfig[];

  services?: ServiceConfig[];

  execution?: {
    enabled?: boolean;

    events?: {
      enabled: boolean;
    };

    artifacts?: {
      enabled: boolean;
    };
  };

  events?: RuntimeEventBus;

  db?: DB;

  //flow?: unknown;
}
