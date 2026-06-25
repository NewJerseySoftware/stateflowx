import { CreateRuntimeConfig } from '../runtime/create-runtime-config.interface.js';

import { RuntimeOptions } from '../runtime/runtime-options.interface.js';

import { initializeExecution } from './initialize-execution.js';

export function initializeRuntimeCapabilities(
  options: RuntimeOptions,
): void {
  //
  // Execution capability
  //
  if (options.execution?.enabled) {
    initializeExecution(options);
  }
}
