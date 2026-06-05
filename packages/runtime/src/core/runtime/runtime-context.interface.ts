import { DB } from '../db.interface.js';
import { RuntimeEventBus } from '../events/runtime-event-bus.js';
import { Protocol } from '../protocol/protocol.interface.js';

import { ProviderManager } from '../provider/provider.manager.js';

import { ServiceManager } from '../service/service.manager.js';
import { ExecutionManager } from './execution/execution-manager.js';

export type PromptHandler = (payload: unknown) => Promise<unknown> | unknown;

export interface RuntimeContext {
  apiKey?:string;
  
  db: DB;

  state: Record<string, unknown>;

  protocol: Protocol;

  events: RuntimeEventBus;

  ai: ProviderManager;

  services: ServiceManager;

  execution: ExecutionManager;

  prompt(route: string, handler: PromptHandler): void;
}
