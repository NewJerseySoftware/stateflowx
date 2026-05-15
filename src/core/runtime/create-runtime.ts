import {
  JSONRPCClient,
  JSONRPCServer,
  JSONRPCServerAndClient,
} from 'json-rpc-2.0';

import { InMemoryDB } from '../storage/in-memory.db';

import { bootstrapRuntime } from './bootstrap';

import { ProviderManager } from '../provider/provider.manager';

import { GeminiProvider } from '../provider/providers/gemini.provider';

import { PingPongApp } from '../../examples/ping-pong/ping-pong.app';

import { RelayOpsApp } from '../../examples/relay-ops/relay-ops.app';

import { JsonRpcProtocol } from '../protocol/json-rpc/json-rpc.protocol';

export function createRuntime(client: any) {
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
