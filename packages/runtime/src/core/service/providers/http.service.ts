import {
  logger,
} from '../../logger/logger.js';

export interface HttpServiceConfig {
  name: string;

  type: 'http';

  method?: 'GET' | 'POST';

  url: string;

  headers?: Record<string, string>;

  body?: unknown;
}

export function createHttpService(
  config: HttpServiceConfig
) {
  logger.debug(
    {
      name: config.name,

      body: config.body
        ? JSON.stringify(
          config.body
        ).length
        : 0,
    },
    'Http service created'
  );

  return {
    name: config.name,

    async execute(
      input?: unknown
    ) {
      //
      // MOCK SERVICES
      //
      if (
        config.url ===
        'mock://weather'
      ) {
        logger.info(
          {
            service: config.name,
          },
          'Executing mock weather service'
        );

        return {
          current_weather: {
            temperature: 72,
            weathercode: 1,
            city: 'Newark',
            condition: 'Clear',
          },
        };
      }


      if (config.url === 'mock://echo') {
        logger.info(
          {
            service: config.name,
          },
          'Executing mock echo service'
        );

        return {
          received: input,
        };
      }


      const method =
        config.method ?? 'GET';

      const requestBody =
        input !== undefined
          ? input
          : config.body;

      const response =
        await fetch(config.url, {
          method,

          headers: {
            ...(requestBody !==
              undefined &&
              method !== 'GET'
              ? {
                'Content-Type':
                  'application/json',
              }
              : {}),

            ...config.headers,
          },

          body:
            requestBody !==
              undefined &&
              method !== 'GET'
              ? JSON.stringify(
                requestBody
              )
              : undefined,
        });

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    },
  };
}
