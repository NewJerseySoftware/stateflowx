import { register, jsonRpcAdapter, InMemoryDB } from '../../src';
import { PingPongApp } from './apps/ping-pong/ping-pong.app';

const server = {
  addMethod(name: string, fn: Function) {
    console.log(`Registered method: ${name}`);
  },
};

const runtimeConfig = {
  adapters: [jsonRpcAdapter],
  db: new InMemoryDB(),
  transport: {
    jsonrpc: server,
  },
};

export function setupRuntime(server) {
  register(PingPongApp, {
    adapters: [jsonRpcAdapter],
    db: new InMemoryDB(),
    transport: { jsonrpc: server },
  });
}

register(PingPongApp, runtimeConfig);