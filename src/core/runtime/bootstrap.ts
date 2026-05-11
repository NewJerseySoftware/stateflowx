import { createRuntimeContext } from './create-runtime-context';

import { RuntimeApp } from './runtime-app.interface';

import { RuntimeConfig } from './runtime-config.interface';

export function bootstrapRuntime(
  apps: RuntimeApp[],
  config: RuntimeConfig,
) {

  apps.forEach((app) => {

    const context =
      createRuntimeContext(
        app,
        config,
      );

    app.register(
      context,
    );
  });
}