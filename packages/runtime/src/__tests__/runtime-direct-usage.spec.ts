import { describe, expect, it, jest } from '@jest/globals';

import { createRuntime } from '../core/runtime/create-runtime.js';

import { GeminiProvider } from '../core/provider/providers/gemini.provider.js';

describe('Runtime Direct Usage', () => {

  it('should bootstrap runtime without client sdk', async () => {

    const transports = [
      {
        capabilities: {
          duplex: false,
          supportsEvents: false,
          persistent: false,
        },

        onMessage: jest.fn(
          async (
            _handler: (clientId: string, payload: unknown) => Promise<unknown>
          ) => { }
        ),

        send: jest.fn(
          async (_clientId: string, _payload: unknown): Promise<void> => { }
        ),

        start: jest.fn(
          async (): Promise<void> => { }
        ),

        stop: jest.fn(
          async (): Promise<void> => { }
        ),
      },
    ];

    const mockProtocol = {};

    const runtime = createRuntime({

      transports,

      protocol: mockProtocol as any,

      providers: [
        {
          name: 'gemini',
          provider: new GeminiProvider(),
        },
      ],

      services: [],

    });

    expect(runtime).toBeDefined();

  });

});
