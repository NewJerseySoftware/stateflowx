import { InMemoryStore } from '../store/in-memory.store.js';

import { CreateRuntimeConfig } from './create-runtime-config.interface.js';

import { RuntimeOptions } from './runtime-options.interface.js';


export function normalizeRuntimeConfig(
  config: CreateRuntimeConfig
): RuntimeOptions {
  return {

    store: config.store ?? new InMemoryStore(),

    transports: config.transports,

    protocol: config.protocol,

    agents: config.agents,

    providers: config.providers,

    services: config.services,

    execution: {
      enabled: config.execution?.enabled ?? false,

      events: {
        enabled: config.execution?.events?.enabled ?? false,
      },

      artifacts: {
        enabled: config.execution?.artifacts?.enabled ?? false,
      },
    },
  };
}
