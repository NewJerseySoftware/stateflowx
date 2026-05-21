import { TransportConfig } from './transport-config.interface.js';

export interface WebSocketTransportOptions {
  url: string;
}

export interface WebSocketTransportConfig extends TransportConfig {
  type: 'websocket';
  url: string;
}

export function websocket(
  options: WebSocketTransportOptions
): WebSocketTransportConfig {
  return {
    type: 'websocket',
    ...options,
  };
}
// export function websocket(options: WebSocketTransportConfig): WebSocketTransportConfig {
//   return {
//     ...options,
//   };
// }
