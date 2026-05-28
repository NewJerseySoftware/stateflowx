import { InMemoryDB } from '../storage/in-memory.db.js';

import { RuntimeContext } from './runtime-context.interface.js';
import { RuntimeApp } from './runtime-app.interface.js';
import { RuntimeConfig } from './runtime-config.interface.js';

import { ServiceManager } from '../service/service.manager.js';
import { ProviderManager } from '../provider/provider.manager.js';
import { RuntimeEventBus } from '../events/runtime-event-bus.js';
import { ExecutionManager } from './execution/execution-manager.js';

export function createRuntimeContext(
  app: RuntimeApp,
  config: RuntimeConfig
): RuntimeContext {
  const db = config.db ? config.db : new InMemoryDB();

  const providerManager = new ProviderManager(config.providers);
  const serviceManager = new ServiceManager(config.services);

  return {
    db,

    state: {},

    protocol: config.protocol,

    ai: providerManager,

    services: serviceManager,

    events: config.events!, //ts can't fully infer this, but im ensure it's set in bootstrapRuntime

    execution: new ExecutionManager(),

    prompt(route: string, handler: Function) {
      config.protocol?.addMethod(route, handler);
    },
  };
}
