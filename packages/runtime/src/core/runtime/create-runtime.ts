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

    //todo: initializeRuntimeCapabilities ( runtime)
  initializeRuntimeCapabilities(options);

  runtime.transport.onMessage(async (clientId, payload) => {
    //
    // Runtime ingress event
    //
    runtime.events?.emit({
      id: randomUUID(),

      type: 'runtime.message.received',

      timestamp: Date.now(),

      source: 'transport',

      payload,
    });

    const response = await runtime.protocol.receive(payload);

    //
    // Push-based transports
    // (WebSocket, MQTT, TCP)
    //
    if (response !== undefined) {
      await runtime.transport.send(clientId, response);
    }

    //
    // Runtime response event
    //
    runtime.events?.emit({
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

  return runtime;
}
