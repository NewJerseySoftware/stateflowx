import { ProviderOptions } from './provider-options.interface.js';

export function mockProvider(options: ProviderOptions = {}) {
  return {
    type: 'mockProvider',
    priority: options.priority ?? 0,
  };
}
