import { Agent } from '@stateflowx/common';

export class MockAgent implements Agent {
  name = 'weather-agent';

  async execute(payload?: unknown): Promise<unknown> {
    return {
      success: true,
      payload,
    };
  }
}
