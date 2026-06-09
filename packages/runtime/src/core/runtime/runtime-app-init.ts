import { RuntimeApp } from '../../core/runtime/runtime-app.interface.js';

import { RuntimeContext } from '../../core/runtime/runtime-context.interface.js';

import { logger } from '../../core/logger/logger.js';

import { createHttpService } from '../service/providers/http.service.js';

export class RuntimeInitializeApp implements RuntimeApp {
  register(runtime: RuntimeContext) {
    runtime.prompt(
      'runtime.precheck',

      async (payload: unknown) => {
        if (typeof payload !== 'object' || payload === null) {
          throw new Error('Invalid runtime config payload');
        }

        const config = payload as {
          apiKey?: string;
        };

        const apiKey = config.apiKey ?? runtime.apiKey;

        if (runtime.ai.precheck) {
          await runtime.ai.precheck(apiKey);
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

        logger.info(
          {
            hasApiKey: !!config.apiKey,
          },
          'Gemini API key received'
        );

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
              const workflowExecutionId = runtime.execution.start(
                'workflow',
                workflow.route
              );

              runtime.events.emit({
                type: 'workflow.started',

                metadata: {
                  workflow: workflow.route,
                  executionId: workflowExecutionId,
                },
              });

              try {
                console.log('[REGISTERED SERVICES]', runtime.services.list());

                const service = runtime.services.get(workflow.service);

                if (!service) {
                  throw new Error(`Service not found: ${workflow.service}`);
                }

                const serviceExecutionId = runtime.execution.start(
                  'service',
                  workflow.service,
                  workflowExecutionId
                );

                runtime.events.emit({
                  type: 'service.started',

                  metadata: {
                    service: workflow.service,
                    executionId: serviceExecutionId,
                    parentId: workflowExecutionId,
                  },
                });

                const data = await service.execute();

                runtime.execution.complete(serviceExecutionId);

                runtime.events.emit({
                  type: 'service.completed',

                  metadata: {
                    service: workflow.service,
                    executionId: serviceExecutionId,
                    parentId: workflowExecutionId,
                  },
                });

                const enhancedPrompt = `
          ${workflow.prompt}

          DATA:
          ${JSON.stringify(data)}
        `;

                const providerExecutionId = runtime.execution.start(
                  'provider',
                  workflow.provider,
                  workflowExecutionId
                );

                runtime.events.emit({
                  type: 'provider.started',

                  metadata: {
                    provider: workflow.provider,
                    executionId: providerExecutionId,
                    parentId: workflowExecutionId,
                  },
                });

                const apiKey = config.apiKey ?? runtime.apiKey;

                // const result =
                //   await runtime.ai.generate(enhancedPrompt, apiKey);
                const result = await runtime.agents.execute('weather-agent', {
                  prompt: enhancedPrompt,
                  data,
                  apiKey,
                });

                runtime.execution.complete(providerExecutionId);

                runtime.events.emit({
                  type: 'provider.completed',

                  metadata: {
                    provider: workflow.provider,
                    executionId: providerExecutionId,
                    parentId: workflowExecutionId,
                  },
                });

                runtime.execution.complete(workflowExecutionId);

                runtime.events.emit({
                  type: 'workflow.completed',

                  metadata: {
                    workflow: workflow.route,
                    executionId: workflowExecutionId,
                  },
                });

                return result;
              } catch (err) {
                runtime.execution.fail(workflowExecutionId);

                runtime.events.emit({
                  type: 'workflow.failed',

                  metadata: {
                    workflow: workflow.route,
                    executionId: workflowExecutionId,
                  },

                  payload: {
                    error: String(err),
                  },
                });

                throw err;
              }
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
