
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

  async generate(
    prompt: string,
    apiKey?: string,
    providerName = this.defaultProvider
  ): Promise<string> {
    const provider = this.get(providerName);

    return provider.generate(prompt, apiKey);
  }

  async precheck(
    apiKey?: string,
    providerName = this.defaultProvider
  ): Promise<boolean> {

    const provider =
      this.get(providerName);

    await provider.precheck?.(apiKey);

    return true;
  }
}
