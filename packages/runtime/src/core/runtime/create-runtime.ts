import { randomUUID } from 'crypto';

import { initializeRuntimeCapabilities } from '../init/initialize-runtime-capabilities.js';

import { CreateRuntimeConfig } from './create-runtime-config.interface.js';

import { normalizeRuntimeConfig } from './normalize-runtime-config.js';

import { RuntimeOptions } from './runtime-options.interface.js';

import { Runtime } from './Runtime.js';

export function createRuntime(config: CreateRuntimeConfig) {

  const options: RuntimeOptions = normalizeRuntimeConfig(config);

  const runtime =
    new Runtime(options);

  initializeRuntimeCapabilities(runtime);

  for (const transport of runtime.transports) {

    transport.onMessage(async (clientId, payload) => {

      runtime.events?.emit({
        id: randomUUID(),
        type: 'runtime.message.received',
        timestamp: Date.now(),
        source: 'transport',
        payload,
      });

      const response = await runtime.protocol.receive(payload);

      if (response !== undefined) {
        await transport.send(clientId, response);
      }

      runtime.events?.emit({
        id: randomUUID(),
        type: 'runtime.message.completed',
        timestamp: Date.now(),
        source: 'runtime',
        payload: response,
      });

      return response;
    });
  }
  return runtime;
}
