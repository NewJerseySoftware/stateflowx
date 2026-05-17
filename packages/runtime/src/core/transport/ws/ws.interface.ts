import { WebSocket } from 'ws';
import { JSONRPCServerAndClient } from 'json-rpc-2.0';
import { ConnectionMetadata } from './connection-metadata.interface.js';

export interface IWebSocket extends WebSocket {
  id: string;

  runtime: JSONRPCServerAndClient;

  metadata: ConnectionMetadata;
}