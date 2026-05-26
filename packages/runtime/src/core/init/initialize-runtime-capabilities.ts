import { CreateRuntimeConfig }
    from "../runtime/create-runtime-config.interface.js";

import { RuntimeConfig }
    from "../runtime/runtime-config.interface.js";

import { initializeExecution }
    from "./initialize-execution.js";



export function initializeRuntimeCapabilities(
    runtime: RuntimeConfig,
    config: CreateRuntimeConfig,
): void {

    //
    // Execution capability
    //
    if (config.execution?.enabled) {

        initializeExecution(
            runtime,
            config,
        );

    }

}