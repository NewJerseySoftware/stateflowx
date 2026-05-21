import {
  JSONRPCClient,
  JSONRPCServer,
  JSONRPCServerAndClient,
} from 'json-rpc-2.0';

import { InMemoryDB } from '../storage/in-memory.db.js';

import { bootstrapRuntime } from './bootstrap.js';

import { JsonRpcProtocol } from '../protocol/json-rpc/json-rpc.protocol.js';

//import { RuntimeConfig } from './runtime-config.interface.js';

import { CreateRuntimeConfig } from './create-runtime-config.interface.js';
import { RuntimeConfig } from './runtime-config.interface.js';

// interface RuntimeClient {
//   send(data: string): void;
// }

export function createRuntime(
  //client: RuntimeClient,
  config: CreateRuntimeConfig
) {
  const runtimeConfig: RuntimeConfig = {
    db: config.db ?? new InMemoryDB(),
    protocol: config.protocol,
    providers: config.providers,
    services: config.services,
  };

  config.transport.onMessage(
    async (clientId, payload) => {

      const response =
        await config.protocol.receive(
          payload
        );

      console.log(
        'PROTOCOL RESPONSE:',
        response
      );

      //
      // Push-based transports
      // (websocket, mqtt, tcp)
      // send responses
      //
      if (response !== undefined) {

        await config.transport.send(
          clientId,
          response
        );
      }

      //
      // Request/response transports
      // (http)
      // use direct return values
      //
      return response;
    }
  );

  return runtimeConfig;

  // const jsonSC =
  //   new JSONRPCServerAndClient(
  //     new JSONRPCServer(),

  //     new JSONRPCClient(
  //       async (request) => {
  //         if (!request.id) {
  //           return;
  //         }

  //         await config.transport.send(
  //           request.id.toString(),
  //           {
  //             success: true,
  //             payload: request,
  //             requestId:
  //               request.id.toString(),
  //           }
  //         );
  //       }
  //     )
  //   );

  // const runtimeConfig: RuntimeConfig = {
  //   db:
  //     config.db ??
  //     new InMemoryDB(),

  //   // transport:
  //   //   config.transport,

  //   protocol:
  //     config.protocol,

  //   providers:
  //     config.providers,

  //   services:
  //     config.services,
  // };

  // config.transport.onMessage(
  //   async (payload) => {
  //     await jsonSC.receiveAndSend(
  //       payload as any
  //     );
  //   }
  // );
  // config.transport.onMessage(
  //   async (message) => {
  //     await jsonSC.receiveAndSend({
  //       jsonrpc: '2.0',

  //       method: message.type,

  //       params: message.payload,

  //       id: message.requestId,
  //     });
  //   }
  // );
  //return runtimeConfig;

  // const jsonSC = new JSONRPCServerAndClient(
  //   new JSONRPCServer(),

  //   new JSONRPCClient((request) => {
  //     client.send(JSON.stringify(request));

  //     return Promise.resolve();
  //   })
  // );

  // const runtimeConfig: RuntimeConfig = {
  //   db: config.db ?? new InMemoryDB(),
  //   protocol: new JsonRpcProtocol(jsonSC.server),
  //   providers: config.providers,
  //   services: config.services,
  // };

  // const runtimeConfig: RuntimeConfig = {
  //   db: config.db ?? new InMemoryDB(),

  //   transport: config.transport,

  //   protocol: new JsonRpcProtocol(jsonSC.server),

  //   providers: config.providers,

  //   services: config.services,
  // };
  // bootstrapRuntime(config.apps, runtimeConfig);
  // return {
  //   receiveAndSend(payload: unknown) {
  //     return jsonSC.receiveAndSend(payload as any);
  //   },
  // };
}
