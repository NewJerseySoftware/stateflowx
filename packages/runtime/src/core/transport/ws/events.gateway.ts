import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { randomUUID } from 'crypto';
import { RawData } from 'ws';

import { isObject } from 'class-validator';
import { Server } from 'ws';

import { createRuntime } from '../../runtime/create-runtime.js';
import { IWebSocket } from './ws.interface.js';
import { applicationInputTypes } from './utils.js';
import { logger } from '../../logger/logger.js';

interface Runtime {
  receiveAndSend(payload: unknown): void;
}

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
    client.id = randomUUID();
    logger.info(
      {
        clientId: client.id,
        transport: 'websocket',
        protocol: 'json-rpc',
        connectedAt: Date.now(),
      },
      'Client connected'
    );

    const runtime = createRuntime(client);

    client.runtime = runtime;

    client.on('message', (msg: RawData) => {
      const rawMessage = msg.toString();

      logger.debug(
        {
          clientId: client.id,
          size: rawMessage.length,
        },
        'Incoming websocket message'
      );

      try {
        const data: unknown = JSON.parse(rawMessage);

        runtime.receiveAndSend(data);
      } catch (err: unknown) {
        logger.error(
          {
            clientId: client.id,
            err,
          },
          'Runtime execution failed'
        );
      }
    });
  }

  handleMessage(client: IWebSocket, payload: unknown) {
    client.runtime.receiveAndSend(payload);
  }

  handleDisconnect(
    @ConnectedSocket()
    clientWS: IWebSocket
  ) {
    logger.info(
      {
        clientId: clientWS.id,
      },
      'Client disconnected'
    );

    this.clientsMap.delete(clientWS.id);
  }

  afterInit() {
    logger.info('WebSocketGateway initialized');
  }

  // responseToClient(jsonSC: any, message: unknown): void {
  //   jsonSC.receiveAndSend(JSON.parse(message));
  // }
  responseToClient(runtime: Runtime, message: unknown): void {
    runtime.receiveAndSend(message);
  }

  responseToALLClients(message: unknown): void {
    this.server.clients.forEach((client: IWebSocket) => {
      if (client.readyState === 1) {
        this.responseToClient(client.runtime, message);
      }
    });
  }

  isValidObject(value: unknown, client: IWebSocket): boolean {
    if (typeof value === 'object' && value !== null && 'data' in value) {
      const data = value.data;

      if (applicationInputTypes(data)) {
        if (typeof data === 'string') {
          const len = data.length;

          if (len <= this.maxDataLength) {
            return isObject(value);
          }

          client.terminate();

          logger.warn(
            {
              clientId: client.id,
              maxDataLength: this.maxDataLength,
            },
            'Payload exceeded max length'
          );

          return false;
        }

        client.terminate();

        logger.warn(
          {
            clientId: client.id,
            reason: 'invalid-data-input',
          },
          'Client terminated'
        );

        return false;
      }
    }

    client.terminate();

    logger.warn(
      {
        clientId: client.id,
        reason: 'invalid-data-type',
      },
      'Client terminated'
    );

    return false;
  }
}
