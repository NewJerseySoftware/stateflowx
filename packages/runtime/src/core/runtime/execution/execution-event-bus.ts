import { EventEmitter } from 'events';

import { ExecutionContext } from '@stateflowx/common';

export class ExecutionEventBus {
  private emitter = new EventEmitter();

  emit(execution: ExecutionContext): void {
    this.emitter.emit(execution.type, execution);

    this.emitter.emit('*', execution);
  }

  on(
    type: string,

    handler: (execution: ExecutionContext) => void
  ): void {
    this.emitter.on(type, handler);
  }
}
