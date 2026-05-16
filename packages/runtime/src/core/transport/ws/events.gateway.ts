import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { isObject } from 'class-validator';
import { Server } from 'ws';

import { createRuntime } from '../../runtime/create-runtime.js';
import { IWebSocket } from './ws.interface.js';
import { applicationInputTypes } from './utils.js';

@WebSocketGateway()
export default class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server & {
    clients: Set<IWebSocket>;
  };

  clientsMap = new Map<string, IWebSocket>();

  maxDataLength = 1500;

  handleConnection(client: IWebSocket) {
    console.log('Client connected');

    const runtime = createRuntime(client);

    client.jsonSC = runtime;

    client.on('message', (msg: any) => {
      console.log('incoming:', msg.toString());

      try {
        const data = JSON.parse(msg.toString());

        runtime.receiveAndSend(data);
      } catch (err) {
        console.error('Invalid JSON:', err);
      }
    });
  }

  handleMessage(client: IWebSocket, payload: any) {
    client.jsonSC.receiveAndSend(payload);
  }

  handleDisconnect(
    @ConnectedSocket()
    clientWS: IWebSocket
  ) {
    console.log(`${clientWS.id} disconnected`);

    this.clientsMap.delete(clientWS.id);
  }

  afterInit() {
    console.log('WebSocketGateway initialized');
  }

  responseToClient(jsonSC: any, message: any): void {
    jsonSC.receiveAndSend(JSON.parse(message));
  }

  responseToALLClients(message: any): void {
    this.server.clients.forEach((client: IWebSocket) => {
      if (client.readyState === 1) {
        this.responseToClient(client.jsonSC, message);
      }
    });
  }

  isValidObject(value: any, client: IWebSocket): boolean {
    if (applicationInputTypes(value.data)) {
      if (typeof value.data === 'string') {
        const len = value.data.length;

        if (len <= this.maxDataLength) {
          return isObject(value);
        }

        client.terminate();

        console.log(
          `data length over ${this.maxDataLength} disconnecting client: ${client.id}`
        );

        return false;
      }

      client.terminate();

      console.log(`data input error disconnecting client: ${client.id}`);

      return false;
    }

    client.terminate();

    console.log(`data input wrong type disconnecting client: ${client.id}`);

    return false;
  }
}
