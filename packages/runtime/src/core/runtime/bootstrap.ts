import { createHttpService } from '../service/providers/http.service.js';
import { createRuntimeContext } from './create-runtime-context.js';

import { RuntimeApp } from './runtime-app.interface.js';

import { RuntimeConfig } from './runtime-config.interface.js';



export function bootstrapRuntime(
  apps: RuntimeApp[],
  config: RuntimeConfig
) {


  apps.forEach((app) => {
    const context = createRuntimeContext(
      app,
      config
    );

    app.register(context);
  });
}
