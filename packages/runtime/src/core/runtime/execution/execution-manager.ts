import { randomUUID } from 'crypto';

import { ExecutionEventBus } from './execution-event-bus.js';

import { ExecutionContext } from '@stateflowx/common';
import { Store } from '../../store/store-interface.js';

//import { Store } from '../../store/in-memory.store.js';

export class ExecutionManager {

  readonly events = new ExecutionEventBus();

  readonly enabled:boolean;

  private executions = new Map<string, ExecutionContext>();


  constructor(
    private readonly store?: Store,
    enabled = true
  ){
    this.enabled = enabled;
  }



  start(
    type: 'flow' | 'workflow' | 'service' | 'provider',

    name: string,

    parentId?: string
  ): string {
    if (!this.enabled) {
        throw new Error('Execution manager is disabled.');
    }

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
    if(!this.enabled) return;

    const execution = this.executions.get(id);

    if (!execution) {
      return;
    }

    execution.status = 'completed';

    execution.completedAt = Date.now();

    this.events.emit(execution);
  }

  fail(id: string): void {
    if(!this.enabled) return;

    const execution = this.executions.get(id);

    if (!execution) {
      return;
    }

    execution.status = 'failed';

    execution.completedAt = Date.now();

    this.events.emit(execution);
  }
}
