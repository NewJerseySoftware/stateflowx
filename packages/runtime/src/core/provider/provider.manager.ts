import { ProviderExecutionRequest } from './provider-execution-request.interface.js';
import { ProviderConfig } from './provider.config.interface.js';
import { AgentProvider } from './provider.interface.js';

export class ProviderManager {
  private providers = new Map<string, AgentProvider>();

  private defaultProvider = 'gemini';

  constructor(providers: ProviderConfig[] = []) {
    providers.forEach(({ name, provider }) => {
      this.register(name, provider);
    });
  }

  private resolveProvider(providerName?: string): string {
    if (!providerName || providerName === 'default') {
      return this.defaultProvider;
    }

    return providerName;
  }

  register(name: string, provider: AgentProvider) {
    this.providers.set(name, provider);
  }

  get(name: string): AgentProvider {
    const provider = this.providers.get(name);

    if (!provider) {
      throw new Error(`Provider not found: ${name}`);
    }

    return provider;
  }

  async execute(
    providerName: string | undefined,
    request: ProviderExecutionRequest
  ): Promise<string> {
    const provider = this.get(this.resolveProvider(providerName));

    return provider.execute(request);
  }

  async precheck(apiKey?: string, providerName?: string): Promise<boolean> {
    const provider = this.get(this.resolveProvider(providerName));

    await provider.precheck?.(apiKey);

    return true;
  }
}
