export interface GeminiOptions {
  apiKey: string;
}

export function gemini(options: GeminiOptions) {
  return {
    type: 'gemini',
    ...options,
  };
}