import { CreateRuntimeConfig } 
    from './create-runtime-config.interface.js';

import { RuntimeConfig } 
    from './runtime-config.interface.js';

import { InMemoryDB } 
    from '../storage/in-memory.db.js';

export function normalizeRuntimeConfig(
  config: CreateRuntimeConfig
): RuntimeConfig {
  return {
    apiKey: config?.apiKey ?? process.env.GEMINI_API_KEY ?? '',

    db: config.db ?? new InMemoryDB(),

    transport: config.transport,

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
