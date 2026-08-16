import { RuntimeApp } from '../../core/runtime/runtime-app.interface.js';

import { RuntimeContext } from '../../core/runtime/runtime-context.interface.js';

import { logger } from '../../core/logger/logger.js';

import { createHttpService } from '../service/providers/http.service.js';

import { RuntimeInitializationConfig } from './runtime-initialization-config.interface.js';

import { Orchestrator } from '../orchestration/orchestrator.js';

export class RuntimeInitializeApp implements RuntimeApp {

  register(runtime: RuntimeContext) {

    runtime.prompt(
      'runtime.precheck',

      async (payload: unknown) => {

        if (typeof payload !== 'object' || payload === null) {
          throw new Error('Invalid runtime config payload');
        }

        const config = payload as RuntimeInitializationConfig;

        const providerName = config.providers[0]?.type;

        const apiKey =
          config.apiKey ?? runtime.apiKey;

        if (runtime.providers.precheck) {
          await runtime.providers.precheck(
            apiKey,
            providerName
          );
        }

        return {
          success: true,
        };
      }
    );

    runtime.prompt(
      'runtime.initialize',

      async (payload: unknown) => {

        logger.info('runtime.initialize invoked');

        if (typeof payload !== 'object' || payload === null) {
          throw new Error('Invalid runtime config payload');
        }

        const config = payload as {
          apiKey?: string;

          providers?: Array<{
            name: string;
            priority: number;
          }>;

          services?: Array<{
            name: string;

            type: 'http';

            method?: 'GET' | 'POST';

            url: string;

            headers?: Record<string, string>;

            body?: unknown;
          }>;

          workflows?: Array<{
            route: string;

            service: string;

            provider?: string;

            prompt: string;
          }>;
        };

        logger.info(
          {
            hasApiKey: !!config.apiKey,
          },
          'API key received from client'
        );

        //
        // CONFIGURE PROVIDERS
        //
        config.providers?.forEach((provider) => {

          runtime.providers.setPriority(
            provider.name,
            provider.priority
          );

        });

        //
        // REGISTER SERVICES
        //
        config.services?.forEach((serviceConfig) => {

          if (serviceConfig.type === 'http') {

            const service =
              createHttpService(serviceConfig);

            runtime.services.register(service);

            logger.info(
              {
                service: serviceConfig.name,
              },
              'Service registered'
            );

          }
        });

        //
        // REGISTER WORKFLOWS
        //
        const orchestrator =
          new Orchestrator(runtime);

        orchestrator.register(
          {
            workflows: config.workflows ?? [],
          },
          config.apiKey
        );

        return {
          success: true,
        };
      }
    );
  }
}
