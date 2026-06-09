import { Agent } from './agent.interface';

export interface AgentConfig {
  name: string;

  type?: string;

  priority?: number;

  agent?: Agent;

  options?: Record<string, unknown>;
}
