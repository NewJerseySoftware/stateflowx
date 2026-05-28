import { EventEmitter } from 'events';

import { RuntimeEvent } from './runtime-event.js';

export class RuntimeEventBus {
  private emitter = new EventEmitter();

  emit(event: RuntimeEvent): void {
    this.emitter.emit(event.type, event);

    this.emitter.emit('*', event);
  }

  on(type: string, handler: (event: RuntimeEvent) => void): void {
    this.emitter.on(type, handler);
  }
}
