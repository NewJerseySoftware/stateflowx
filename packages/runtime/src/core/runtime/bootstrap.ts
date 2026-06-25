import { RuntimeEventBus } from '../events/runtime-event-bus.js';

import { createRuntimeContext } from './create-runtime-context.js';

import { RuntimeApp } from './runtime-app.interface.js';

import { RuntimeOptions } from './runtime-options.interface.js';

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
// export function bootstrapRuntime(apps: RuntimeApp[], runtime: Runtime) {
//   //
//   // SINGLE SHARED RUNTIME EVENT BUS
//   //
//   const events = runtime.events ?? new RuntimeEventBus();

//   apps.forEach((app) => {
//     console.log('[BOOTSTRAP AGENTS]', runtime.agents);

//     const context = createRuntimeContext(app, {
//       ...runtime,
//       events,
//       //flow: config.flow ?? new Flow1(),
//     });

//     app.register(context);
//   });
// }
