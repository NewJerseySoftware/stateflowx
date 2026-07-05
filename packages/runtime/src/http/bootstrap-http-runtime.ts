import { NestFactory } from '@nestjs/core';

import { HttpRuntimeModule } from '../http-runtime.module.js';

import { HttpTransport } from '../core/transport/http/http.transport.js';

import { JsonRpcProtocol } from '../core/protocol/json-rpc/json-rpc.protocol.js';

import { createRuntime } from '../core/runtime/create-runtime.js';

import { bootstrapRuntime } from '../core/runtime/bootstrap.js';

export async function bootstrapHttpRuntime(config: any = {}) {

  const app = await NestFactory.create(HttpRuntimeModule, {
    cors: true,
  });

  const transport =
    app.get(HttpTransport);

  const protocol =
    new JsonRpcProtocol();

  const runtime =
    createRuntime({

      transports: [
        transport,
      ],

      protocol,

      ...config,
    });

  //
  // Runtime lifecycle
  //
  // 1. Bootstrap application components
  // 2. Initialize runtime
  // 3. Start runtime
  //
  bootstrapRuntime(
    config.apps ?? [],

    runtime
  );

  await runtime.initialize();

  await runtime.start();

  const port =
    config.port ?? 3000;

  await app.listen(port);

  console.log(
    `StateFlowX runtime listening on http://localhost:${port}/rpc`
  );

  return {
    app,
    runtime,
    transport,
  };
}
