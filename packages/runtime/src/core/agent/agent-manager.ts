import { AgentConfig } from '@stateflowx/common';

import { Agent } from '@stateflowx/common';

export class AgentManager {

  private readonly agents = new Map<string, Agent>();

  readonly enabled: boolean;

  constructor(
    agents: AgentConfig[] = [],
    enabled = true,
  ) {
    this.enabled = enabled;

    if (!this.enabled) return;

    agents.forEach(({ name, agent }) => {
      if (!agent) return;

      this.register(name, agent);
    });
  }


  async execute(name: string, payload?: unknown): Promise<unknown> {
    if (!this.enabled) {
      throw new Error('Agent manager is disabled.');
    }

    const agent = this.find(name);

    if (!agent) {
      throw new Error(`Agent "${name}" not found`);
    }

    return agent.execute(payload);
  }



  private register(name: string, agent: Agent): void {
    this.agents.set(name, agent);
  }



  find(name: string): Agent | undefined {
    if (!this.enabled) return;

    return this.agents.get(name);
  }



  getAll(): Agent[] {
    if (!this.enabled) return [];

    return [...this.agents.values()];
  }
}
