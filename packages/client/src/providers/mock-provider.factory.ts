import { ProviderOptions } from './provider-options.interface.js';

export function mockProvider(options: ProviderOptions = {}) {
  return {
    name: 'mock',
    ...options,
  };
}
