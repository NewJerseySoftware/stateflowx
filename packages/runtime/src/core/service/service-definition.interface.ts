export interface HttpServiceDefinition {
  name: string;

  type: 'http';

  method?: 'GET' | 'POST';

  url: string;

  headers?: Record<string, string>;

  body?: unknown;
}

export type ServiceDefinition = HttpServiceDefinition;
