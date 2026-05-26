import { CreateRuntimeConfig } from '../runtime/create-runtime-config.interface.js';

import { RuntimeConfig } from '../runtime/runtime-config.interface.js';

import { initializeExecutionArtifacts } from './initialize-execution-artifacts.js';

import { initializeExecutionEvents } from './initialize-execution-events.js';

export function initializeExecution(
  runtime: RuntimeConfig,
  config: CreateRuntimeConfig
): void {
  if (!config.execution?.enabled) {
    return;
  }

  //
  // execution events
  if (config.execution?.events?.enabled) {
    initializeExecutionEvents(runtime);
  }

  //
  // Execution artifacts
  //
  if (config.execution?.artifacts?.enabled) {
    initializeExecutionArtifacts(runtime, config);
  }
}
