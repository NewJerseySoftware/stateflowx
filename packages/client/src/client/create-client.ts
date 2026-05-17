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


// return {
//   connect() {
//     return connected;
//   },
//   async request<TResponse, TParams = unknown>(
//     method: string,
//     params?: TParams
//   ): Promise<TResponse> {
//     return rpc.request(method, params) as Promise<TResponse>;
//   },
// };
//}

// import { JSONRPCClient } from 'json-rpc-2.0';

// export interface ClientConfig {
//   transport: {
//     url: string;
//   };
// }

// export interface ClientRequest {
//   method: string;
//   params?: unknown;
// }

// export function createClient(config: ClientConfig) {
//   const socket = new WebSocket(config.transport.url);

//   const rpc = new JSONRPCClient((request) => {
//     socket.send(JSON.stringify(request));

//     return Promise.resolve();
//   });

//   socket.onmessage = (event: MessageEvent<string>) => {
//     rpc.receive(JSON.parse(event.data));
//   };

//   return {
//     request(method: string, params?: unknown) {
//       return rpc.request(method, params);
//     },
//   };
// }
