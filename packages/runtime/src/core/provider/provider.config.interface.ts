import { AgentProvider } from './provider.interface.js';

export interface ProviderConfig {
  name: string;

  provider: AgentProvider;

  priority?: number;
}
