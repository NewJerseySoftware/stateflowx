export interface StateFlowXConfig {
  protocol: unknown;

  transport: {
    url: string;
  };

  providers?: unknown[];

  services?: Array<{
    name: string;

    type: 'http';

    method?: 'GET' | 'POST';

    url: string;

    headers?: Record<string, string>;

    body?: unknown;
  }>;

  workflows?: Array<{
    route: string;

    service: string;

    provider: string;

    prompt: string;
  }>;
}
