import {
  JSONRPCClient,
  JSONRPCServer,
  JSONRPCServerAndClient,
} from 'json-rpc-2.0';

import { InMemoryDB } from '../storage/in-memory.db.js';

import { bootstrapRuntime } from './bootstrap.js';

import { ProviderManager } from '../provider/provider.manager.js';

import { GeminiProvider } from '../provider/providers/gemini.provider.js';


import { JsonRpcProtocol } from '../protocol/json-rpc/json-rpc.protocol.js';
import { PingPongApp } from '../../examples/ping-pong/ping-pong.app.js';
import { RelayOpsApp } from '../../examples/relay-ops/relay-ops.app.js';

interface RuntimeClient {
  send(data: string): void;
}

export function createRuntime(client: RuntimeClient) {
  const jsonSC = new JSONRPCServerAndClient(
    new JSONRPCServer(),
    new JSONRPCClient((request) => {
      client.send(JSON.stringify(request));
    })
  );

  const providers = new ProviderManager();

  providers.register('default', new GeminiProvider());

  const runtimeConfig = {
    db: new InMemoryDB(),

    protocol: new JsonRpcProtocol(jsonSC.server),

    providers,
  };

  bootstrapRuntime([new PingPongApp(), new RelayOpsApp()], runtimeConfig);

  return jsonSC;
}
