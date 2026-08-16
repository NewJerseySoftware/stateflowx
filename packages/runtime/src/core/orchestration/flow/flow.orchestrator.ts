import { RuntimeContext } from '../../runtime/runtime-context.interface.js';
import { logger } from '../../logger/logger.js';
import { ActionBuilder } from '../../flow/actions/action.builder.js';
import { ServiceActionExecutor } from '../../flow/actions/service/service-action.executor.js';
import { ProviderActionExecutor } from '../../flow/actions/provider/provider-action.executor.js';

import { FlowConfig } from '@stateflowx/common';

export class FlowOrchestrator {

    private readonly actionBuilder = new ActionBuilder();

    private readonly serviceActionExecutor: ServiceActionExecutor;

    private readonly providerActionExecutor: ProviderActionExecutor;

    constructor(
        private readonly runtime: RuntimeContext
    ) {
        this.serviceActionExecutor =
            new ServiceActionExecutor(runtime);

        this.providerActionExecutor =
            new ProviderActionExecutor(runtime);
    }

    register(
        flows: FlowConfig[]
    ): void {

        flows.forEach((flow) => {

            this.runtime.prompt(
                flow.route,

                async () => {

                    const actions =
                        await this.actionBuilder.buildActions(
                            flow.actions
                        );

                    const results =
                        new Map<string, unknown>();

                    let flowResult: unknown;

                    for (const action of actions) {

                        let result: unknown;

                        if (action.log) {
                            console.log(
                                '[ACTION EXECUTING]',
                                action.id,
                                action.type
                            );
                        }

                        if (action.type === 'service') {

                            result =
                                await this.serviceActionExecutor.execute(
                                    action
                                );
                        }

                        if (action.type === 'provider') {

                            result =
                                await this.providerActionExecutor.execute(
                                    action,
                                    results
                                );
                        }

                        results.set(
                            action.id,
                            result
                        );

                        if (action.output) {
                            flowResult = result;
                        }

                        if (action.log) {
                            console.log(
                                '[ACTION RESULT]',
                                action.id,
                                result
                            );
                        }
                    }

                    logger.info(
                        {
                            flow: flow.name,
                            route: flow.route,
                        },
                        'Flow completed'
                    );
                    return flowResult;
                }
            );

            logger.info(
                {
                    flow: flow.name,
                    route: flow.route,
                },
                'Flow registered'
            );
        });
    }
}