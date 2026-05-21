import { TransportConfig } from './transport-config.interface.js';

export interface HttpTransportOptions {
  url: string;
}

export interface HttpTransportConfig extends TransportConfig {
  type: 'http';

  url: string;
}

export function http(options: HttpTransportOptions): HttpTransportConfig {
  return {
    type: 'http',
    ...options,
  };
}
