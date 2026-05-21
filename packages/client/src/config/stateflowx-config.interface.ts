import { ClientProtocol } from '../protocol/json-rpc.factory.js';
import { TransportConfig } from '../transport/transport-config.interface.js';

export interface StateFlowXConfig {
  protocol: ClientProtocol;

  transport: TransportConfig;

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
