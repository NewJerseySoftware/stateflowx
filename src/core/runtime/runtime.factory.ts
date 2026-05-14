import {
  JSONRPCClient,
  JSONRPCServer,
  JSONRPCServerAndClient,
} from 'json-rpc-2.0';

import { InMemoryDB }
from '../../adapters/db/in-memory.db';

import { bootstrapRuntime }
from './bootstrap';

import { ProviderManager }
from '../provider/provider.manager';

import { GeminiProvider }
from '../provider/providers/gemini.provider';

import { PingPongApp }
from '../../examples/ping-pong/ping-pong.app';

import { RelayOpsApp }
from '../../examples/relay-ops/relay-ops.app';

import { JsonRpcProtocol }
from '../protocol/json-rpc/json-rpc.protocol';

import { WebSocketTransport }
from '../transport/websocket/websocket.transport';

export function createRuntime(
  client: any,
) {

  const jsonSC =
    new JSONRPCServerAndClient(
      new JSONRPCServer(),
      new JSONRPCClient((request) => {

        client.send(
          JSON.stringify(request),
        );
      }),
    );

  /*
   * Providers
   */

  const providers =
    new ProviderManager();

  providers.register(
    'default',
    new GeminiProvider(),
  );

  /*
   * Runtime Config
   */

  const runtimeConfig = {

    db: 
      new InMemoryDB(),

    protocol:
      new JsonRpcProtocol(
        jsonSC.server,
      ),

    transport:
      new WebSocketTransport(
        client,
      ),

    providers,
  };

  /*
   * Runtime Apps
   */

  bootstrapRuntime(
    [
      new PingPongApp(),
      new RelayOpsApp(),
    ],
    runtimeConfig,
  );

  return jsonSC;
}



// import {
//   JSONRPCClient,
//   JSONRPCServer,
//   JSONRPCServerAndClient,
// } from 'json-rpc-2.0';

// import { jsonRpcAdapter } from '../../adapters/json-rpc/jsonrpc.adapter';

// import { InMemoryDB } from '../../adapters/db/in-memory.db';

// import { bootstrapRuntime } from './bootstrap';

// import { PingPongApp } from '../../demo/apps/ping-pong/ping-pong.app';

// import { RelayOpsApp } from '../../examples/relay-ops/relay-ops.app';

// export function createRuntime(client: any) {

//   const jsonSC =
//     new JSONRPCServerAndClient(
//       new JSONRPCServer(),
//       new JSONRPCClient((request) => {
//         client.send(JSON.stringify(request));
//       }),
//     );

//   const runtimeConfig = {
//     adapters: [jsonRpcAdapter],
//     db: new InMemoryDB(),
//     transport: {
//       jsonrpc: jsonSC.server,
//     },
//   };

//   bootstrapRuntime(
//     jsonSC.server,
//     [
//       PingPongApp,
//       RelayOpsApp,
//     ],
//     runtimeConfig,
//   );

//   return jsonSC;
// }