import {
  describe,
  expect,
  it,
} from '@jest/globals';

import {
  ServiceAction,
} from '@stateflowx/common';

import {
  RuntimeContext,
} from '../core/runtime/runtime-context.interface.js';

import {
  ServiceActionExecutor,
} from '../core/flow/actions/service/service-action.executor.js';

describe(
  'ServiceActionExecutor',
  () => {
    it(
      'should pass a connected action result into the service',
      async () => {
        const storedResult = {
          city: 'Jersey City',

          temperature: 24.5,

          condition: 'Cloudy',
        };

        let receivedInput: unknown;

        const service = {
          name: 'weather-consumer',

          async execute(
            input?: unknown
          ) {
            receivedInput = input;

            return {
              consumed: true,

              input,
            };
          },
        };

        const runtime = {
          services: {
            get(name: string) {
              return name ===
                'weather-consumer'
                ? service
                : undefined;
            },
          },
        } as RuntimeContext;

        const executor =
          new ServiceActionExecutor(
            runtime
          );

        const action:
          ServiceAction = {
          id: 'consume-weather',

          type: 'service',

          service:
            'weather-consumer',

          inputConnectors: [
            {
              actionId:
                'weather-store',
            },
          ],

          output: true,
        };

        const results =
          new Map<string, unknown>([
            [
              'weather-store',
              storedResult,
            ],
          ]);

        const result =
          await executor.execute(
            action,
            results
          );

        expect(
          receivedInput
        ).toEqual(storedResult);

        expect(result).toEqual({
          consumed: true,

          input: storedResult,
        });
      }
    );
  }
);