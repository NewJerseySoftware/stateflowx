import { logger } from '../logger/logger.js';
import { ProviderExecutionRequest } from './provider-execution-request.interface.js';
import { ProviderConfig } from './provider.config.interface.js';
import { AgentProvider } from './provider.interface.js';

export class ProviderManager {
  private providers = new Map<string, AgentProvider>();

  readonly enabled: boolean;

  private defaultProvider?: string;

  constructor(
    providers: ProviderConfig[] = [],
    enabled = true
  ) {
    this.enabled = enabled;

    providers.forEach(({ name, provider }) => {
      this.register(name, provider);
    });
  }

  setDefaultProvider(name: string): void {
    if (!this.providers.has(name)) {
      throw new Error(` Cannot set default provider. Provider not found: ${name}`);
    }

    this.defaultProvider = name;

    logger.info(
      {
        provider: name,
      },
      'Default provider set'
    );
  }

  private resolveProvider(providerName?: string): string {
    if (!providerName || providerName === 'default') {
      if (!this.defaultProvider) {
        throw new Error('No default provider configured..');
      }

      return this.defaultProvider;
    }

    return providerName;
  }

  register(name: string, provider: AgentProvider): void {
    logger.info(
      {
        provider: name,
      },
      'Provider registered'
    );

    this.providers.set(name, provider);

    //  first registered becomes is default
    if (!this.defaultProvider) {
      this.defaultProvider = name;
    }
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
    const resolvedProvider = this.resolveProvider(providerName);

    logger.info(
      {
        provider: resolvedProvider,
      },
      'Executing provider'
    );

    return this.get(resolvedProvider).execute(request);
  }

  async precheck(
    apiKey?: string,
    providerName?: string
  ): Promise<boolean> {
    const resolvedProvider = this.resolveProvider(providerName);

    logger.info(
      {
        provider: resolvedProvider,
      },
      'Prechecking provider'
    );

    await this.get(resolvedProvider).precheck?.(apiKey);

    return true;
  }
}
