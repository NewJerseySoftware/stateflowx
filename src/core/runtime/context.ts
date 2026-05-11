import { InMemoryDB } from '../../adapters/db/in-memory.db';
import { AppContext } from '../app-context.interface';
import { StateflowApp } from '../app.interface';
import { RuntimeConfig } from './runtime-config.interface';

export function createContext(
  app: StateflowApp,
  config: RuntimeConfig,
): AppContext {
  const db = config.db ? config.db : new InMemoryDB(app.name);

  return {
    db,
    state: {},
    transport: config.transport,
  };
}
