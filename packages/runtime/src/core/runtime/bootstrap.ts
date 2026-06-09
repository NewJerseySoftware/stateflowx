import { RuntimeEventBus } from '../events/runtime-event-bus.js';

import { createRuntimeContext } from './create-runtime-context.js';

import { RuntimeApp } from './runtime-app.interface.js';

import { RuntimeConfig } from './runtime-config.interface.js';

export function bootstrapRuntime(apps: RuntimeApp[], config: RuntimeConfig) {
  //
  // SINGLE SHARED RUNTIME EVENT BUS
  //
  const events = config.events ?? new RuntimeEventBus();

  apps.forEach((app) => {
    console.log('[BOOTSTRAP AGENTS]', config.agents);

    const context = createRuntimeContext(app, {
      ...config,
      events,
      //flow: config.flow ?? new Flow1(),
    });

    app.register(context);
  });
}
