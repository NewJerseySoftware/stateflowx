import { InMemoryDB } from '../../adapters/db/in-memory.db';
import { RuntimeContext } from './runtime-context.interface';
import { RuntimeApp } from './runtime-app.interface';
import { RuntimeConfig } from './runtime-config.interface';

export function createRuntimeContext(
  app: RuntimeApp,
  config: RuntimeConfig,
): RuntimeContext {

  const db =
    config.db
      ? config.db
      : new InMemoryDB();

  return {
    db,

    state: {},

    transport:
      config.transport,

    protocol:
      config.protocol,

    ai:
      config.providers,

    prompt(
      route: string,
      handler: Function,
    ) {

      config.protocol?.addMethod(
        route,
        handler,
      );
    },
  };
}