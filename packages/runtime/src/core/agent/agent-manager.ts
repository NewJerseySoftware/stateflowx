import { AgentConfig } from '@stateflowx/common';

import { Agent } from '@stateflowx/common';

export class AgentManager {
  private readonly agents = new Map<string, Agent>();

  constructor(agents: AgentConfig[] = []) {
    console.log(
      '[AGENT MANAGER CTOR]',
      agents.length,
      agents.map((a) => a.name)
    );

    agents.forEach(({ name, agent }) => {
      console.log('[AGENT CONFIG]', name, agent);

      if (!agent) {
        return;
      }

      this.register(name, agent);
    });
  }

  register(name: string, agent: Agent): void {
    this.agents.set(name, agent);
  }

  find(name: string): Agent | undefined {
    return this.agents.get(name);
  }

  async execute(name: string, payload?: unknown): Promise<unknown> {
    const agent = this.find(name);

    if (!agent) {
      throw new Error(`Agent "${name}" not found`);
    }

    return agent.execute(payload);
  }

  getAll(): Agent[] {
    return [...this.agents.values()];
  }
}
