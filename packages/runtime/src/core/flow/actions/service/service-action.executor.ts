import {
    ServiceAction,
} from '@stateflowx/common';

import {
    RuntimeContext,
} from '../../../runtime/runtime-context.interface.js';

export class ServiceActionExecutor {
    constructor(
        private readonly runtime: RuntimeContext
    ) { }

    async execute(
        action: ServiceAction,
        results: Map<string, unknown>
    ): Promise<unknown> {
        const service =
            this.runtime.services.get(
                action.service
            );

        if (!service) {
            throw new Error(
                `Service not found: ${action.service}`
            );
        }

        const input =
            this.resolveInput(
                action,
                results
            );

        return service.execute(input);
    }

    private resolveInput(
        action: ServiceAction,
        results: Map<string, unknown>
    ): unknown {
        const connectors =
            action.inputConnectors ?? [];

        if (connectors.length === 0) {
            return undefined;
        }

        if (connectors.length === 1) {
            const actionId =
                connectors[0].actionId;

            if (!results.has(actionId)) {
                throw new Error(
                    `Input not available: ${actionId}`
                );
            }

            return results.get(actionId);
        }

        const input:
            Record<string, unknown> = {};

        for (const connector of connectors) {
            if (
                !results.has(connector.actionId)
            ) {
                throw new Error(
                    `Input not available: ${connector.actionId}`
                );
            }

            input[connector.actionId] =
                results.get(connector.actionId);
        }

        return input;
    }
}