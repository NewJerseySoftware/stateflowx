import { Runtime } from '../runtime/Runtime.js';

import { initializeExecution } from './initialize-execution.js';

export function initializeRuntimeCapabilities(
  runtime: Runtime,
): void {

  if (runtime.execution?.enabled) {
    initializeExecution(runtime);
  }

}
