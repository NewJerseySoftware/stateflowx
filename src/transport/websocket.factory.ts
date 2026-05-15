export interface WebSocketTransportOptions {
  url: string;
}

export function websocket(options: WebSocketTransportOptions) {
  return {
    type: 'websocket',
    ...options,
  };
}
