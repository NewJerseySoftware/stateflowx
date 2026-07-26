import { InMemoryStore } from '../store/in-memory.db.js';

import { CreateRuntimeConfig } from './create-runtime-config.interface.js';

import { RuntimeOptions } from './runtime-options.interface.js';


export function normalizeRuntimeConfig(
  config: CreateRuntimeConfig
): RuntimeOptions {
  return {
    apiKey:
      config?.apiKey ??
      process.env.OPENAI_API_KEY ??
      process.env.GEMINI_API_KEY ??
      process.env.GOOGLE_ADK_API_KEY ??
      '',
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
