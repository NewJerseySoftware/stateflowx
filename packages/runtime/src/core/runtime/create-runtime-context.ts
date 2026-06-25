import { RuntimeContext } from "./runtime-context.interface.js";

import { Runtime } from "./Runtime.js";

export function createRuntimeContext(
    runtime: Runtime
): RuntimeContext {

    return {

        apiKey: runtime.apiKey,

        db: runtime.db,

        state: {},

        protocol: runtime.protocol,

        agents: runtime.agents,

        providers: runtime.providers,

        services: runtime.services,

        events: runtime.events,

        execution: runtime.execution,

        prompt(route, handler) {

            runtime.protocol.addMethod(
                route,
                handler
            );

        }

    };

}
