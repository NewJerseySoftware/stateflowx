import { RuntimeEventBus } from '../events/runtime-event-bus.js';

import { Protocol } from '../protocol/protocol.interface.js';

import { ProviderManager } from '../provider/provider.manager.js';

import { ServiceManager } from '../service/service.manager.js';

import { ExecutionManager } from './execution/execution-manager.js';

import { AgentManager } from '../agent/agent-manager.js';

import { Store } from '../store/in-memory.store.js';

export type PromptHandler = (payload: unknown) => Promise<unknown> | unknown;

export interface RuntimeContext {

  apiKey?: string;

  store?: Store;

  protocol: Protocol;

  events: RuntimeEventBus;

  agents: AgentManager;

  providers: ProviderManager;

  services: ServiceManager;

  execution: ExecutionManager;

  prompt(route: string, handler: PromptHandler): void;
}
