import { RuntimeApp } from '../../core/runtime/runtime-app.interface.js';

import { RuntimeContext } from '../../core/runtime/runtime-context.interface.js';

import { logger } from '../../core/logger/logger.js';
import { createHttpService } from '../service/providers/http.service.js';

export class RuntimeInitializeApp implements RuntimeApp {
  register(runtime: RuntimeContext) {
    runtime.prompt(
      'runtime.initialize',

      async (payload: unknown) => {
        logger.info('runtime.initialize invoked');

        if (typeof payload !== 'object' || payload === null) {
          throw new Error('Invalid runtime config payload');
        }

        const config = payload as {
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

            provider: string;

            prompt: string;
          }>;
        };

        //
        // REGISTER SERVICES
        //
        config.services?.forEach((serviceConfig) => {
          if (serviceConfig.type === 'http') {
            const service = createHttpService(serviceConfig);

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
        config.workflows?.forEach((workflow) => {
          runtime.prompt(
            workflow.route,

            async () => {
              const service = runtime.services.get(workflow.service);

              if (!service) {
                throw new Error(`Service not found: ${workflow.service}`);
              }

              const data = await service.execute();

              const enhancedPrompt = `
              ${workflow.prompt}

                DATA:
                ${JSON.stringify(data)}
                `;

              return runtime.ai.generate(enhancedPrompt);
            }
          );

          logger.info(
            {
              route: workflow.route,
            },
            'Workflow registered'
          );
        });

        return {
          success: true,
        };
      }
    );
  }
}
