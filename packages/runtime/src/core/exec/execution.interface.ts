export enum ExecutionState {
  QUEUED = 'queued',
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELED = 'canceled'
}

export interface Execution {
  id: string;

  parentExecutionId?: string;

  type: string;

  status: ExecutionState;

  createdAt: number;
  updatedAt: number;

  startedAt?: number;
  completedAt?: number;

  metadata?: Record<string, unknown>;
}
