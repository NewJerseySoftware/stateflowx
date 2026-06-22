import { ProviderExecutionRequest } from '../provider-execution-request.interface.js';
import { AgentProvider } from '../provider.interface.js';

export class MockProvider implements AgentProvider {
  async execute(request: ProviderExecutionRequest): Promise<string> {
    const response = `Mock response for prompt: "${prompt}"`;

    return response;
  }
}
