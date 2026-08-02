import { GoogleADKAgent } from '../../agent/google-adk-agent.js';
import { AgentProvider, ProviderExecutionRequest } from '../provider-execution-request.interface.js';


export class GoogleAdkProvider implements AgentProvider {

  
  constructor(private readonly agent: GoogleADKAgent) {}

  async execute(request: ProviderExecutionRequest): Promise<string> {
    return this.agent.execute(request) as Promise<string>;
  }

  async precheck(): Promise<void> {
    return;
  }
}
