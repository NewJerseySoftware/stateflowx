import { EventEmitter } from 'events';


export interface RuntimeEvent {
  id: string;

  type: string;

  timestamp: number;

  executionId?: string;

  source?: string;

  payload?: unknown;
}


export class RuntimeEventBus {
  private emitter = new EventEmitter();

  emit(event: RuntimeEvent): void {
    this.emitter.emit(event.type, event);
  }

  on(type: string, handler: (event: RuntimeEvent) => void): void {
    this.emitter.on(type, handler);
  }
}