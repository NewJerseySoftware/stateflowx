import {
  AgentProvider,
  ProviderExecutionRequest
} from '../provider-execution-request.interface.js';

export class MockProvider implements AgentProvider {

  async execute(
    request: ProviderExecutionRequest
  ): Promise<string> {

    return `Mock response for prompt: "${request.prompt}"`;
  }

  async precheck(): Promise<void> {
    // mock provider is always happy
    return;
  }
}
