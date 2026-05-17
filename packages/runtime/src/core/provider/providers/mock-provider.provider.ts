import { AgentProvider } from '../provider.interface.js';

export class MockProvider implements AgentProvider {
  async generate(prompt: string): Promise<string> {
    console.log('MockProvider prompt:', prompt);

    const response = `Mock response for prompt: "${prompt}"`;

    console.log('MockProvider response:', response);

    return response;
  }
}