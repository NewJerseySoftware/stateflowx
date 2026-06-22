import { GoogleADKAgent } from '../../agent/google-adk-agent.js';
import { ProviderExecutionRequest } from '../provider-execution-request.interface.js';
import { AgentProvider } from '../provider.interface.js';

export class GoogleAdkProvider implements AgentProvider {
  constructor(private readonly agent: GoogleADKAgent) {}

  async execute(request: ProviderExecutionRequest): Promise<string> {
    return this.agent.execute(request) as Promise<string>;
  }

  async precheck(): Promise<void> {
    return;
  }
}
