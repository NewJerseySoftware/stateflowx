import { WebSocket } from 'ws';
import { JSONRPCServerAndClient } from 'json-rpc-2.0';

export interface IWebSocket extends WebSocket {

  id: string;

  roomID: string;

  userDBID: string;

  gameID: string;

  seat: string;

  jsonSC: JSONRPCServerAndClient;

  eligableForDBCleanup: boolean;
}