import { ProviderExecutionRequest } 
    from './provider-execution-request.interface.js';

export interface AgentProvider {

  precheck?(apiKey?: string): Promise<void>;

  execute(request: ProviderExecutionRequest): Promise<string>;
}
