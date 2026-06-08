import { JSONRPCClient, JSONRPCResponse }
  from 'json-rpc-2.0';

import { StateFlowXConfig }
  from '../config/stateflowx-config.interface.js';

import { RuntimeEnvelope }
  from '@stateflowx/common/events/runtime-envelope.js';

export interface ClientApi {
  connect(): Promise<void>;

  precheck<TResponse = unknown>(
    params?: unknown
  ): Promise<TResponse>;

  request<TResponse, TParams = unknown>(
    method: string,
    params?: TParams
  ): Promise<TResponse>;

  onRuntimeEvent(
    handler: (event: unknown) => void
  ): void;

  onConnect(
    handler: () => void
  ): void;

  onDisconnect(
    handler: () => void
  ): void;
}

export function createClient(config: StateFlowXConfig): ClientApi {
  // StateFlowX currently standardizes on JSON-RPC
  // as the runtime protocol layer.
  //
  // future protocol adapters MAY exist later
  // (gRPC, REST, custom transports, etc),
  // but V1 intentionally uses JSON-RPC
  // for request/response protocol

  if (config.protocol.type !== 'json-rpc') {
    throw new Error(`Unsupported protocol: ${config.protocol.type}`);
  }


  // TODO:
  // HTTP transport temporarily disabled.
  // Re-enable after lifecycle hooks and precheck()
  // semantics are finalized.
  // if (config.transport.type === 'http') {
  //   return {
  //     async connect() {
  //       return Promise.resolve();
  //     },

  //     async request<TResponse, TParams = unknown>(
  //       method: string,
  //       params?: TParams
  //     ): Promise<TResponse> {
  //       const response = await fetch(config.transport.url, {
  //         method: 'POST',

  //         headers: {
  //           'Content-Type': 'application/json',
  //         },

  //         body: JSON.stringify({
  //           jsonrpc: '2.0',
  //           method,
  //           params,
  //           id: crypto.randomUUID(),
  //         }),
  //       });

  //       const text = await response.text();

  //       if (!text) {
  //         throw new Error('Empty HTTP response from StateFlowX runtime');
  //       }

  //       const json = JSON.parse(text);

  //       if (json.error) {
  //         throw new Error(json.error.message ?? 'JSON-RPC error');
  //       }

  //       return json.result as TResponse;
  //     },

  //     onRuntimeEvent(): void {
  //       throw new Error(
  //         'Runtime events are not supported over HTTP transport.'
  //       );
  //     },
  //   };
  // }

  if (config.transport.type === 'websocket') {

    const runtimeEventHandlers:
      Array<(event: unknown) => void> = [];

    const connectHandlers:
      Array<() => void> = [];

    const disconnectHandlers:
      Array<() => void> = [];

    let socket:
      WebSocket | null = null;

    let rpc:
      JSONRPCClient | null = null;

    let connected = false;


    return {

      async connect(): Promise<void> {
        if (connected) {
          return;
        }

        socket =
          new WebSocket(config.transport.url);

        await new Promise<void>((resolve, reject) => {
          socket!.addEventListener('open', () => {
            connected = true;

            connectHandlers.forEach(
              handler => handler()
            );

            resolve();
          });

          socket!.addEventListener('close', () => {
            connected = false;

            disconnectHandlers.forEach(
              handler => handler()
            );

            socket = null;

            rpc = null;
          });

          socket!.addEventListener('error', (err) => {
            reject(err);
          });
        });

        rpc = new JSONRPCClient((request) => {
          if (!socket || socket.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket is not connected');
          }

          socket.send(JSON.stringify(request));

          return Promise.resolve();
        });

        socket.addEventListener('message', (event: MessageEvent<string>) => {
          const parsed = JSON.parse(event.data);

          // runtime event stream
          if (
            typeof parsed === 'object' &&
            parsed !== null &&
            'type' in parsed &&
            parsed.type === 'runtime.event'
          ) {

            const envelope =
              parsed as RuntimeEnvelope;

            runtimeEventHandlers.forEach(
              handler => handler(envelope)
            );

            return;
          }

          rpc!.receive(
            parsed as JSONRPCResponse | JSONRPCResponse[]
          );
        });

      },

      async request<TResponse, TParams = unknown>(
        method: string,
        params?: TParams
      ): Promise<TResponse> {
        if (!rpc) {
          throw new Error('Client is not connected. Call connect() first.');
        }

        return rpc.request(method, params) as Promise<TResponse>;
      },


      async precheck<TResponse = unknown>(
        params?: unknown
      ): Promise<TResponse> {
        if (!rpc) {
          throw new Error(
            'Client is not connected. Call connect() first.'
          );
        }

        return rpc.request(
          'runtime.precheck',
          params
        ) as Promise<TResponse>;
      },



      onConnect(
        handler: () => void
      ): void {
        connectHandlers.push(handler);
      },

      onDisconnect(
        handler: () => void
      ): void {
        disconnectHandlers.push(handler);
      },

      onRuntimeEvent(handler: (event: unknown) => void): void {
        runtimeEventHandlers.push(handler);
      },


    };
  }

  throw new Error(`Unsupported transport: ${config.transport.type}`);
}
