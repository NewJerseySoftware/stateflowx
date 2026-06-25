import { CreateRuntimeConfig } from '../runtime/create-runtime-config.interface.js';

import { RuntimeOptions } from '../runtime/runtime-options.interface.js';

import { initializeExecutionArtifacts } from './initialize-execution-artifacts.js';

import { initializeExecutionEvents } from './initialize-execution-events.js';

export function initializeExecution(
  options: RuntimeOptions,
): void {
  if (!options.execution?.enabled) {
    return;
  }

  //
  // execution events
  if (options.execution?.events?.enabled) {
    initializeExecutionEvents(options);
  }

  //
  // Execution artifacts
  //
  if (options.execution?.artifacts?.enabled) {
    initializeExecutionArtifacts(options);
  }
}
