import { createRuntimeContext } from './create-runtime-context.js';

import { RuntimeApp } from './runtime-app.interface.js';

import { Runtime } from './Runtime.js';


export function bootstrapRuntime(
    apps: RuntimeApp[],
    runtime: Runtime
) {
    for (const app of apps) {

        app.register(
            createRuntimeContext(runtime)
        );
    }
}
