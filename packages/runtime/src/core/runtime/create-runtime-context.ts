import { InMemoryDB } from '../storage/in-memory.db.js';

import { RuntimeContext } from './runtime-context.interface.js';

import { RuntimeApp } from './runtime-app.interface.js';

import { RuntimeConfig } from './runtime-config.interface.js';

import { ServiceManager } from '../service/service.manager.js';

import { ProviderManager } from '../provider/provider.manager.js';

import { ExecutionManager } from './execution/execution-manager.js';

import { AgentManager } from '../agent/agent-manager.js';

export function createRuntimeContext(
  _app: RuntimeApp,
  config: RuntimeConfig
): RuntimeContext {
  const db = config.db ? config.db : new InMemoryDB();

  const providerManager = new ProviderManager(config.providers ?? []);

  const serviceManager = new ServiceManager(config.services ?? []);

  const agentManager = new AgentManager(config.agents ?? []);

  console.log('[CONTEXT AGENTS]', config.agents);

  console.log('[AGENT MANAGER]', agentManager.getAll());

  return {
    apiKey: config?.apiKey,

    db,

    state: {},

    protocol: config.protocol,

    agents: agentManager,

    providers: providerManager,

    services: serviceManager,

    events: config.events!, //ts can't fully infer this, but im ensure it's set in bootstrapRuntime

    execution: new ExecutionManager(),

    prompt(route: string, handler: Function) {
      config.protocol?.addMethod(route, handler);
    },

    //flow: config.flow,
  };
}
