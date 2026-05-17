import { ProviderOptions } from "./provider-options.interface.js";


export function gemini(options: ProviderOptions) {
  return {
    type: 'gemini',
    ...options,
  };
}