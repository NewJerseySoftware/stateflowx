import { InMemoryDB } from '../storage/in-memory.db.js';
import { RuntimeContext } from './runtime-context.interface.js';
import { RuntimeApp } from './runtime-app.interface.js';
import { RuntimeConfig } from './runtime-config.interface.js';

export function createRuntimeContext(
  app: RuntimeApp,
  config: RuntimeConfig
): RuntimeContext {
  const db = config.db ? config.db : new InMemoryDB();

  return {
    db,

    state: {},

    //transport: config.transport,

    protocol: config.protocol,

    ai: config.providers,

    prompt(route: string, handler: Function) {
      config.protocol?.addMethod(route, handler);
    },
  };
}
