import { logger } from '../logger/logger.js';

import { RegisteredAgentProvider } from './agent-provider-registration.interface.js';

import { ProviderExecutionRequest } from './provider-execution-request.interface.js';

import { ProviderConfig } from './provider.config.interface.js';

export class ProviderManager {

  private providers = new Map<string, RegisteredAgentProvider>();

  readonly enabled: boolean;

  constructor(
    providers: ProviderConfig[] = [],
    enabled = true
  ) {
    this.enabled = enabled;

    providers.forEach((config, index) => {
      this.register({
        name: config.name,
        retry: {
          attempts: 3,
          delay: 1000,
        },
        timeout: 30000,
        // priority: doesn't matter here,
        provider: config.provider,
      });
    });
  }


  setPriority(name: string, priority: number): void {
    const provider = this.get(name);
    provider.priority = priority;
  }

  private getHighestPriorityProvider(): RegisteredAgentProvider {

    const providers = [...this.providers.values()];

    if (providers.length === 0) {
      throw new Error('No providers configured.');
    }

    return providers.reduce((highest, current) =>
      (current.priority ?? Number.MAX_SAFE_INTEGER) <
        (highest.priority ?? Number.MAX_SAFE_INTEGER)
        ? current
        : highest
    );
  }

  private getFallbackProviders(
    selectedProvider: string
  ): RegisteredAgentProvider[] {
    return [...this.providers.values()]
      .filter(provider => provider.name !== selectedProvider)
      .sort((a, b) =>
        (a.priority ?? Number.MAX_SAFE_INTEGER) -
        (b.priority ?? Number.MAX_SAFE_INTEGER)
      );
    // .sort((a, b) =>
    //   (b.priority ?? Number.NEGATIVE_INFINITY) -
    //   (a.priority ?? Number.NEGATIVE_INFINITY)
    // );
  }

  private resolveProvider(providerName?: string): string {

    //workflow explicit provider
    if (providerName && providerName !== 'default') {

      return providerName;
    }

    const providers = [...this.providers.values()];

    if (providers.length === 0) {
      return 'gemini';
    }

    if (providers.length === 1) {
      return providers[0].name;
    }

    const selected = this.getHighestPriorityProvider();

    logger.info(
      {
        provider: selected.name,
        priority: selected.priority,
      },
      'Provider selected by priority'
    );

    return selected.name;
  }

  register(provider: RegisteredAgentProvider): void {

    logger.info(
      {
        provider: provider.name,
        priority: provider.priority,
      },
      'Provider ready'
    );

    this.providers.set(provider.name, provider);
  }

  get(name: string): RegisteredAgentProvider {

    const provider = this.providers.get(name);

    if (!provider) {
      throw new Error(`Provider not found: ${name}`);
    }

    return provider;
  }

  private async executeProvider(
    provider: RegisteredAgentProvider,
    request: ProviderExecutionRequest
  ): Promise<string> {

    return provider.provider.execute(request);
  }

  async execute(
    providerName: string | undefined,
    request: ProviderExecutionRequest
  ): Promise<string> {

    ///
    // First choice:
    // - workflow provider if specified
    // - otherwise automatic selection
    //
    const selected = this.get(
      this.resolveProvider(providerName)
    );

    if (providerName && providerName !== 'default') {

      logger.info(
        {
          provider: selected.name,
        },
        'Workflow overrides provider priority'
      );

    }

    const providers = [
      selected,
      ...this.getFallbackProviders(selected.name),
    ];

    let lastError: unknown;

    for (const provider of providers) {

      try {

        logger.info(
          {
            provider: provider.name,
          },
          'Executing provider'
        );

        return await this.executeProvider(
          provider,
          request
        );

      } catch (error) {

        lastError = error;

        logger.warn(
          {
            provider: provider.name,
          },
          'Provider failed. Trying next provider.'
        );
      }
    }

    throw lastError;
  }



  async precheck(
    apiKey?: string,
    providerName?: string
  ): Promise<boolean> {

    const selected = this.get(
      this.resolveProvider(providerName)
    );

    const providers = [
      selected,
      ...this.getFallbackProviders(selected.name),
    ];

    let lastError: unknown;

    for (const provider of providers) {

      try {

        logger.info(
          {
            provider: provider.name,
          },
          'Prechecking provider'
        );

        await provider.provider.precheck?.(apiKey);

        return true;

      } catch (error) {

        lastError = error;

        logger.warn(
          {
            provider: provider.name,
          },
          'Provider precheck failed. Trying next provider.'
        );
      }
    }

    throw lastError;
  }
}
