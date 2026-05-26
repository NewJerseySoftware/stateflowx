import { describe, expect, it, jest } from '@jest/globals';

import { createRuntime } from '../core/runtime/create-runtime.js';

import { GeminiProvider } from '../core/provider/providers/gemini.provider.js';

describe('Runtime Direct Usage', () => {
  it('should bootstrap runtime without client sdk', async () => {
    const mockTransport = {
      onMessage: jest.fn(),
      send: jest.fn(),
      start: jest.fn(),
    };

    const mockProtocol = {};

    const runtime = createRuntime({
      transport: mockTransport as any,
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
