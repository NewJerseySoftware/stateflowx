import { DB } from '../db.interface.js';

import { ProviderManager } from '../provider/provider.manager.js';

import { ServiceManager } from '../service/service.manager.js';

export type PromptHandler = (payload: unknown) => Promise<unknown> | unknown;

export interface Protocol {
  register(route: string, handler: PromptHandler): void;
}

export interface RuntimeContext {
  db: DB;

  state: Record<string, unknown>;

  protocol: Protocol;

  ai: ProviderManager;

  services: ServiceManager;

  prompt(route: string, handler: PromptHandler): void;
}
