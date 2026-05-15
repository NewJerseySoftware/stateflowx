import { AgentProvider } from './provider.interface';

export class ProviderManager {
  private providers = new Map<string, AgentProvider>();

  private defaultProvider = 'default';

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
    providerName = this.defaultProvider
  ): Promise<string> {
    const provider = this.get(providerName);

    return provider.generate(prompt);
  }
}
