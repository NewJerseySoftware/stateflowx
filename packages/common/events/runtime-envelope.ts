import { RuntimeEvent } from './runtime-event.js';

export interface RuntimeEnvelope {
  type: 'runtime.event';

  payload: RuntimeEvent;
}
