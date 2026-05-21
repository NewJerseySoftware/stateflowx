import { InMemoryDB } from '../storage/in-memory.db.js';

import { CreateRuntimeConfig } from './create-runtime-config.interface.js';
import { RuntimeConfig } from './runtime-config.interface.js';

export function createRuntime(
  config: CreateRuntimeConfig
) {
  const runtimeConfig: RuntimeConfig = {
    db: config.db ?? new InMemoryDB(),
    protocol: config.protocol,
    providers: config.providers,
    services: config.services,
  };

  config.transport.onMessage(async (clientId, payload) => {
    const response = await config.protocol.receive(payload);

    console.log('PROTOCOL RESPONSE:', response);

    //
    // Push-based transports
    // (websocket, mqtt, tcp)
    // send responses
    //
    if (response !== undefined) {
      await config.transport.send(clientId, response);
    }

    //
    // Request/response transports
    // (http)
    // use direct return values
    //
    return response;
  });

  return runtimeConfig;
}
