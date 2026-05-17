import { logger } from '../../logger/logger.js';

export interface HttpServiceConfig {
  name: string;

  type: 'http';

  method?: 'GET' | 'POST';

  url: string;

  headers?: Record<string, string>;

  body?: unknown;
}

export function createHttpService(config: HttpServiceConfig) {
  logger.debug(
    {
      name: config.name,
      body: config.body ? JSON.stringify(config.body).length : 0,
    },
    'Http service created'
  );

  return {
    name: config.name,

    async execute() {
      const response = await fetch(config.url, {
        method: config.method ?? 'GET',

        headers: config.headers,

        body: config.body ? JSON.stringify(config.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
  };
}
