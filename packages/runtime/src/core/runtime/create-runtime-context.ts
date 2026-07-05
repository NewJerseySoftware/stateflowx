import { InMemoryStore } from "../store/in-memory.db.js";
import { RuntimeContext } from "./runtime-context.interface.js";

import { Runtime } from "./Runtime.js";

export function createRuntimeContext(
    runtime: Runtime
): RuntimeContext {

    return {

        apiKey: runtime.apiKey,

        store: runtime.store,

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
