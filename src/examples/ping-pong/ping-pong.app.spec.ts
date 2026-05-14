import { JSONRPCServer } from 'json-rpc-2.0';

import { InMemoryDB }
from '../../../src/adapters/db/in-memory.db';

import { ProviderManager }
from '../../../src/core/provider/provider.manager';

import { bootstrapRuntime }
from '../../../src/core/runtime/bootstrap';

import { PingPongApp }
from './ping-pong.app';

import { JsonRpcProtocol }
from '../../../src/core/protocol/json-rpc/json-rpc.protocol';

import { WebSocketTransport }
from '../../../src/core/transport/websocket/websocket.transport';

import {
  describe,
  beforeEach,
  expect,
  it,
} from '@jest/globals';

describe('PingPongApp', () => {

  let server: JSONRPCServer;

  beforeEach(() => {

    server =
      new JSONRPCServer();

    const providers =
      new ProviderManager();

    bootstrapRuntime(
      [
        new PingPongApp(),
      ],
      {

        providers,

        db:
          new InMemoryDB(),

        protocol:
          new JsonRpcProtocol(
            server,
          ),

        transport:
          new WebSocketTransport({
            send: () => {},
          }),
      },
    );
  });

  it('should respond to ping', async () => {

    const result =
      await server.receive({
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

    const result =
      await server.receive({
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
