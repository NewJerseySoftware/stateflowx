import 'dotenv/config';

import {
  describe,
  expect,
  it,
} from '@jest/globals';

import {
  GoogleAdkProvider,
} from '../core/provider/providers/google-adk.provider.js';

describe('GoogleAdkProvider', () => {

  it(
    'should execute a prompt through Google ADK',
    async () => {

      const provider =
        new GoogleAdkProvider();

      const result =
        await provider.execute({
          prompt:
            'Respond with exactly: Hello from Google ADK',
        });

      expect(result).toBe(
        'Hello from Google ADK'
      );
    }
  );

});