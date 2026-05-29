import { randomUUID } from 'crypto';

import { ExecutionEventBus } from './execution-event-bus.js';
import { ExecutionContext } from '@stateflowx/common/execution/execution-context.interface.js';

export class ExecutionManager {
  readonly events = new ExecutionEventBus();

  private executions = new Map<string, ExecutionContext>();

  start(
    type: 'workflow' | 'service' | 'provider',

    name: string,

    parentId?: string
  ): string {
    const id = randomUUID();

    const execution: ExecutionContext = {
      id,

      parentId,

      type,

      name,

      status: 'running',

      startedAt: Date.now(),
    };

    this.executions.set(id, execution);

    this.events.emit(execution);

    return id;
  }

  complete(id: string): void {
    const execution = this.executions.get(id);

    if (!execution) {
      return;
    }

    execution.status = 'completed';

    execution.completedAt = Date.now();

    this.events.emit(execution);
  }

  fail(id: string): void {
    const execution = this.executions.get(id);

    if (!execution) {
      return;
    }

    execution.status = 'failed';

    execution.completedAt = Date.now();

    this.events.emit(execution);
  }
}
