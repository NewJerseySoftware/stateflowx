import { ProviderOptions } from './provider-options.interface.js';

export interface GoogleAdkOptions
  extends ProviderOptions {

  tools?: unknown[];
}

export function googleAdk(
  options: GoogleAdkOptions = {}
) {
  return {
    type: 'googleAdk',
    ...options,
  };
}