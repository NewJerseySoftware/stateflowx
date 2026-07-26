import { ProviderOptions } from './provider-options.interface.js';

export function openai(options: ProviderOptions = {}) {
  return {
    type: 'openai',
    ...options,
  };
}