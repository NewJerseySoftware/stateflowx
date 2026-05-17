import { WebSocket } from 'ws';

import { ConnectionMetadata } from './connection-metadata.interface.js';

export interface RuntimeInstance {
  receiveAndSend(payload: unknown): void;
}

export interface IWebSocket extends WebSocket {
  id: string;

  runtime: RuntimeInstance;

  metadata: ConnectionMetadata;
}













// import { WebSocket } from 'ws';
// import { JSONRPCServerAndClient } from 'json-rpc-2.0';
// import { ConnectionMetadata } from './connection-metadata.interface.js';

// export interface IWebSocket extends WebSocket {
//   id: string;

//   runtime: JSONRPCServerAndClient;

//   metadata: ConnectionMetadata;
// }