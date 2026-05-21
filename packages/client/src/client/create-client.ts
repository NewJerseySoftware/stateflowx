import { JSONRPCClient, JSONRPCResponse } from 'json-rpc-2.0';

import { StateFlowXConfig } from '../config/stateflowx-config.interface.js';

export interface ClientApi {
  connect(): Promise<void>;

  request<TResponse, TParams = unknown>(
    method: string,
    params?: TParams
  ): Promise<TResponse>;
}

export function createClient(config: StateFlowXConfig): ClientApi {
  if (config.protocol.type !== 'json-rpc') {
    throw new Error(`Unsupported protocol: ${config.protocol.type}`);
  }

  if (config.transport.type === 'http') {
    return {
      async connect() {
        return Promise.resolve();
      },

      async request<TResponse, TParams = unknown>(
        method: string,
        params?: TParams
      ): Promise<TResponse> {
        const response = await fetch(config.transport.url, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            jsonrpc: '2.0',
            method,
            params,
            id: crypto.randomUUID(),
          }),
        });

        const text = await response.text();

        //console.log('HTTP RAW RESPONSE:', text);

        if (!text) {
          throw new Error('Empty HTTP response from StateFlowX runtime');
        }

        const json = JSON.parse(text);

        //console.log('HTTP JSON RESPONSE:', json);

        if (json.error) {
          throw new Error(json.error.message ?? 'JSON-RPC error');
        }

        return json.result as TResponse;
      },
    };
  }

  if (config.transport.type === 'websocket') {
    const socket = new WebSocket(config.transport.url);

    const connected = new Promise<void>((resolve, reject) => {
      socket.onopen = () => resolve();

      socket.onerror = (err) => reject(err);
    });

    const rpc = new JSONRPCClient((request) => {
      socket.send(JSON.stringify(request));

      return Promise.resolve();
    });

    socket.onmessage = (event: MessageEvent<string>) => {
      const message = JSON.parse(event.data) as
        | JSONRPCResponse
        | JSONRPCResponse[];

      rpc.receive(message);
    };

    return {
      connect() {
        return connected;
      },

      async request<TResponse, TParams = unknown>(
        method: string,
        params?: TParams
      ): Promise<TResponse> {
        return rpc.request(method, params) as Promise<TResponse>;
      },
    };
  }

  throw new Error(`Unsupported transport: ${config.transport.type}`);
}
