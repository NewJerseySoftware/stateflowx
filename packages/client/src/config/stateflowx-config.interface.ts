import { ClientProtocol } from '../protocol/json-rpc.factory.js';
import { TransportConfig } from '../transport/transport-config.interface.js';
import { AgentConfig } from '@stateflowx/common';

export interface StateFlowXConfig {
  apiKey?: string;

  protocol: ClientProtocol;

  transport: TransportConfig;

  agents?: AgentConfig[];

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
