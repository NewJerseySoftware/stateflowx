import { randomUUID } from 'crypto';

import { initializeRuntimeCapabilities } from '../init/initialize-runtime-capabilities.js';

import { CreateRuntimeConfig } from './create-runtime-config.interface.js';

import { normalizeRuntimeConfig } from './normalize-runtime-config.js';

import { RuntimeConfig } from './runtime-config.interface.js';

export function createRuntime(config: CreateRuntimeConfig) {
  const runtimeConfig: RuntimeConfig = normalizeRuntimeConfig(config);

  initializeRuntimeCapabilities(runtimeConfig, config);

  runtimeConfig.transport.onMessage(async (clientId, payload) => {
    //
    // Runtime ingress event
    //
    runtimeConfig.events?.emit({
      id: randomUUID(),

      type: 'runtime.message.received',

      timestamp: Date.now(),

      source: 'transport',

      payload,
    });

    const response = await runtimeConfig.protocol.receive(payload);

    //
    // Push-based transports
    // (WebSocket, MQTT, TCP)
    //
    if (response !== undefined) {
      await runtimeConfig.transport.send(clientId, response);
    }

    //
    // Runtime response event
    //
    runtimeConfig.events?.emit({
      id: randomUUID(),

      type: 'runtime.message.completed',

      timestamp: Date.now(),

      source: 'runtime',

      payload: response,
    });

    //
    // HTTP transports will ignore
    // transport.send() and instead return the response directly
    //
    return response;
  });

  return runtimeConfig;
}
