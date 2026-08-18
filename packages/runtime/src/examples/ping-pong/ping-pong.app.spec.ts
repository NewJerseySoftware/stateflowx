import { JSONRPCServer } from 'json-rpc-2.0';

import {
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';

import {
  JsonRpcProtocol,
} from '../../core/protocol/json-rpc/json-rpc.protocol.js';

import {
  InMemoryStore,
} from '../../core/store/in-memory.store.js';

import {
  bootstrapRuntime,
} from '../../core/runtime/bootstrap.js';

import {
  Runtime,
} from '../../core/runtime/Runtime.js';

import {
  PingPongApp,
} from './ping-pong.app.js';

describe('PingPongApp', () => {
  let server: JSONRPCServer;

  beforeEach(async () => {
    server = new JSONRPCServer();

    const runtime = new Runtime({
      //apiKey: '',

      transports: [
        {
          capabilities: {
            duplex: false,
            supportsEvents: false,
            persistent: false,
          },

          onMessage: () => {},

          send: async () => {},

          start: async () => {},

          stop: async () => {},
        },
      ],

      protocol: new JsonRpcProtocol(
        server
      ),

      providers: [],

      services: [],

      store: new InMemoryStore(),
    });

    await runtime.initialize();

    bootstrapRuntime(
      [new PingPongApp()],
      runtime
    );
  });

  it(
    'should respond to ping',
    async () => {
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
    }
  );

  it(
    'should increment counter',
    async () => {
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
    }
  );
});