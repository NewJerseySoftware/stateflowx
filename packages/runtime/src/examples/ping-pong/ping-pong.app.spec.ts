import { JSONRPCServer } from 'json-rpc-2.0';
import { describe, beforeEach, expect, it } from '@jest/globals';
import { JsonRpcProtocol } from '../../core/protocol/json-rpc/json-rpc.protocol.js';
import { InMemoryDB } from '../../core/storage/in-memory.db.js';
import { PingPongApp } from './ping-pong.app.js';
import { bootstrapRuntime } from '../../core/runtime/bootstrap.js';
//import { ProviderManager } from '../../core/provider/provider.manager.js';

describe('PingPongApp', () => {
  let server: JSONRPCServer;

  beforeEach(() => {
    server = new JSONRPCServer();

    bootstrapRuntime([new PingPongApp()], {
      providers: [],

      db: new InMemoryDB(),

      protocol: new JsonRpcProtocol(server),

      // transport: new WebSocketTransport({
      //   send: () => {},
      // }),
    });
  });

  it('should respond to ping', async () => {
    const result = await server.receive({
      jsonrpc: '2.0',
      method: 'ping',
      id: 1,
    });

    expect(result).toEqual({
      jsonrpc: '2.0',
      id: 1,
      result: {
        message: 'pong',
        counter: 0,
        time: expect.any(Number),
      },
    });
  });

  it('should increment counter', async () => {
    await server.receive({
      jsonrpc: '2.0',
      method: 'increment',
      id: 1,
    });

    const result = await server.receive({
      jsonrpc: '2.0',
      method: 'ping',
      id: 2,
    });

    expect(result).toEqual({
      jsonrpc: '2.0',
      id: 2,
      result: {
        message: 'pong',
        counter: 1,
        time: expect.any(Number),
      },
    });
  });
});
