import { Runtime } from '../runtime/Runtime.js';

// import { initializeExecutionArtifacts } from './initialize-execution-artifacts.js';

export function initializeExecution(
  runtime: Runtime,
): void {
  if (!runtime.execution?.enabled) {
    return;
  }

  //
}
