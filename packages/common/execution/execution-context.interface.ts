export interface ExecutionContext {
  id: string;

  parentId?: string;

  type: 'flow' | 'workflow' | 'service' | 'provider';

  name: string;

  startedAt: number;

  completedAt?: number;

  status: 'running' | 'completed' | 'failed';
}
