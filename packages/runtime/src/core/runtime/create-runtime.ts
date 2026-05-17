import {
  JSONRPCClient,
  JSONRPCServer,
  JSONRPCServerAndClient,
} from 'json-rpc-2.0';

import { InMemoryDB } from '../storage/in-memory.db.js';

import { bootstrapRuntime } from './bootstrap.js';

import { JsonRpcProtocol } from '../protocol/json-rpc/json-rpc.protocol.js';

import { RuntimeConfig } from './runtime-config.interface.js';

import { CreateRuntimeConfig } from './create-runtime-config.interface.js';

interface RuntimeClient {
  send(data: string): void;
}

export function createRuntime(
  client: RuntimeClient,
  config: CreateRuntimeConfig
) {
  const jsonSC = new JSONRPCServerAndClient(
    new JSONRPCServer(),

    new JSONRPCClient((request) => {
      client.send(JSON.stringify(request));

      return Promise.resolve();
    })
  );

  const runtimeConfig: RuntimeConfig = {
    db: config.db ?? new InMemoryDB(),

    protocol: new JsonRpcProtocol(jsonSC.server),

    providers: config.providers,

    services: config.services,
  };

  bootstrapRuntime(config.apps, runtimeConfig);

  return {
    receiveAndSend(payload: unknown) {
      return jsonSC.receiveAndSend(payload as any);
    },
  };
}

// export function createRuntime(
//   // client: RuntimeClient,
//   // config: CreateRuntimeConfig
//   config: RuntimeConfig
// ) {
//   const jsonSC = new JSONRPCServerAndClient(
//     new JSONRPCServer(),

//     new JSONRPCClient((request) => {
//       client.send(JSON.stringify(request));
//     })
//   );

//   const runtimeConfig: RuntimeConfig = {
//     db: config.db ?? new InMemoryDB(),

//     protocol: new JsonRpcProtocol(jsonSC.server),

//     providers: config.providers,

//     services: config.services,
//   };

//   bootstrapRuntime(config.apps, runtimeConfig);

//   return {
//     receiveAndSend(payload: unknown) {
//       jsonSC.receiveAndSend(payload as any);
//     },
//   };
// }
