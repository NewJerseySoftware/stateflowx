import { RuntimeEventBus }
    from "../events/runtime-event-bus.js";

import { RuntimeConfig }
    from "../runtime/runtime-config.interface.js";


export function initializeExecutionEvents(
    runtime: RuntimeConfig
): void {

    runtime.events =
        new RuntimeEventBus();

}