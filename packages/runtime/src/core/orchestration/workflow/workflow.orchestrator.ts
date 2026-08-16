import { RuntimeContext } from '../../runtime/runtime-context.interface.js';
import { logger } from '../../logger/logger.js';
import { WorkflowConfig } from './workflow.config.js';

/* Legacy Weather hardwired example */

export class WorkflowOrchestrator {

    constructor(
        private readonly runtime: RuntimeContext
    ) { }

    register(
        workflows: WorkflowConfig[],
        apiKey?: string
    ): void {

        workflows.forEach((workflow) => {

            this.runtime.prompt(
                workflow.route,

                async () => {

                    const workflowExecutionId =
                        this.runtime.execution.start(
                            'workflow',
                            workflow.route
                        );

                    this.runtime.events.emit({
                        type: 'workflow.started',

                        metadata: {
                            workflow: workflow.route,
                            executionId: workflowExecutionId,
                        },
                    });

                    try {

                        console.log(
                            '[REGISTERED SERVICES]',
                            this.runtime.services.list()
                        );

                        const service =
                            this.runtime.services.get(workflow.service);

                        if (!service) {
                            throw new Error(
                                `Service not found: ${workflow.service}`
                            );
                        }

                        const serviceExecutionId =
                            this.runtime.execution.start(
                                'service',
                                workflow.service,
                                workflowExecutionId
                            );

                        this.runtime.events.emit({
                            type: 'service.started',

                            metadata: {
                                service: workflow.service,
                                executionId: serviceExecutionId,
                                parentId: workflowExecutionId,
                            },
                        });

                        const data = await service.execute();

                        this.runtime.execution.complete(
                            serviceExecutionId
                        );

                        this.runtime.events.emit({
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

                        const providerExecutionId =
                            this.runtime.execution.start(
                                'provider',
                                workflow.provider ?? 'default',
                                workflowExecutionId
                            );

                        this.runtime.events.emit({
                            type: 'provider.started',

                            metadata: {
                                provider: workflow.provider,
                                executionId: providerExecutionId,
                                parentId: workflowExecutionId,
                            },
                        });

                        const providerApiKey =
                            apiKey ?? this.runtime.apiKey;

                        const result =
                            await this.runtime.providers.execute(
                                workflow.provider,
                                {
                                    prompt: enhancedPrompt,
                                    data,
                                    apiKey: providerApiKey,
                                }
                            );

                        this.runtime.execution.complete(
                            providerExecutionId
                        );

                        this.runtime.events.emit({
                            type: 'provider.completed',

                            metadata: {
                                provider: workflow.provider,
                                executionId: providerExecutionId,
                                parentId: workflowExecutionId,
                            },
                        });

                        this.runtime.execution.complete(
                            workflowExecutionId
                        );

                        this.runtime.events.emit({
                            type: 'workflow.completed',

                            metadata: {
                                workflow: workflow.route,
                                executionId: workflowExecutionId,
                            },
                        });

                        return result;

                    } catch (err) {

                        this.runtime.execution.fail(
                            workflowExecutionId
                        );

                        this.runtime.events.emit({
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
    }
}