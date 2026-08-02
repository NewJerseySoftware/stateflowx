import { ProviderOptions } from './provider-options.interface.js';

export function gemini(options: ProviderOptions) {
  return {
    name: 'gemini',
    ...options,
  };
}
