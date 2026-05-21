import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { randomUUID } from 'crypto';

import { Server } from 'ws';

import { IWebSocket } from './ws.interface.js';

import { logger } from '../../logger/logger.js';

@WebSocketGateway()
export default class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server & {
    clients: Set<IWebSocket>;
  };

  handleConnection(client: IWebSocket) {
    client.id = randomUUID();

    logger.info(
      {
        clientId: client.id,
        transport: 'websocket',
        connectedAt: Date.now(),
      },
      'Client connected'
    );
  }

  handleDisconnect(
    @ConnectedSocket()
    client: IWebSocket
  ) {
    logger.info(
      {
        clientId: client.id,
      },
      'Client disconnected'
    );
  }

  afterInit() {
    logger.info('WebSocketGateway initialized');
  }
}
