import { AgentProvider } from "./provider-execution-request.interface.js";


export interface ProviderConfig {
  
  name: string;

  provider: AgentProvider;

  priority?: number;
}
