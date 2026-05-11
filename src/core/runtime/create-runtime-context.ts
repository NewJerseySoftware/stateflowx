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

    ai:
      config.providers,

    prompt(
      route: string,
      handler: Function,
    ) {

      config.transport?.jsonrpc
        ?.addMethod(
          route,
          handler,
        );
    },
  };
}