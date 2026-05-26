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

  const transport = app.get(HttpTransport);

  const protocol = new JsonRpcProtocol();

  const runtime = createRuntime({
    transport,

    protocol,

    ...config,
  });

  bootstrapRuntime(config.apps ?? [], runtime);

  const port = config.port ?? 3000;

  await app.listen(port);

  console.log(`StateFlowX runtime listening on http://localhost:${port}/rpc`);

  return app;
}
