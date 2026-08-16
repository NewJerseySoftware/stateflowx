import { RuntimeContext } from '../runtime/runtime-context.interface.js';

import { OrchestrationConfig } from './orchestration.config.js';

import { WorkflowOrchestrator } from './workflow/workflow.orchestrator.js';

import { FlowOrchestrator } from './flow/flow.orchestrator.js';
import { mockFlows } from '../mocks/mock-flow-config.js';

export class Orchestrator {

    private readonly workflowOrchestrator: WorkflowOrchestrator;

    private readonly flowOrchestrator: FlowOrchestrator;

    private readonly useMock = false;

    constructor(
        private readonly runtime: RuntimeContext
    ) {
        this.workflowOrchestrator =
            new WorkflowOrchestrator(runtime);

        this.flowOrchestrator =
            new FlowOrchestrator(runtime);
    }

    register(
        config: OrchestrationConfig,
        apiKey?: string
    ): void {

        if (this.useMock) {

            this.flowOrchestrator.register(
                mockFlows
            );

            return;
        }

        if (config.flows?.length) {
            this.flowOrchestrator.register(
                config.flows
            );
        }

        if (config.workflows?.length) {
            this.workflowOrchestrator.register(
                config.workflows,
                apiKey
            );
        }
    }
}