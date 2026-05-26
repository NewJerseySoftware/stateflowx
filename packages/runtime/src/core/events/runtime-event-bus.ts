import { EventEmitter } from 'events';

export interface RuntimeEvent {
  id?: string;

  type: string;

  source?: string;

  workflow?: string;

  service?: string;

  provider?: string;

  payload?: unknown;

  error?: string;

  metadata?: Record<string, unknown>;

  timestamp?: number;
}

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
