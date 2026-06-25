import { RuntimeEventBus } from '../events/runtime-event-bus.js';

import { RuntimeOptions } from '../runtime/runtime-options.interface.js';

export function initializeExecutionEvents(runtime: RuntimeOptions): void {
  runtime.events ??= new RuntimeEventBus();
}
