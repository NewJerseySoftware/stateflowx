import { EventEmitter } from 'events';

import { ExecutionContext } from '@stateflowx/common';

export class ExecutionEventBus {
  private emitter = new EventEmitter();

  readonly enabled: boolean;

  constructor(enabled = true) {
    this.enabled = enabled;
  }

  emit(execution: ExecutionContext): void {
    if (!this.enabled) return;

    this.emitter.emit(execution.type, execution);
    this.emitter.emit('*', execution);

  }

  on(
    type: string,

    handler: (execution: ExecutionContext) => void
  ): void {
    if (!this.enabled) return;
    this.emitter.on(type, handler);
  }
}
