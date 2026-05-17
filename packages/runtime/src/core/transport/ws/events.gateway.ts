import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { randomUUID } from 'crypto';

import { RawData, Server, WebSocket } from 'ws';

import { isObject } from 'class-validator';

import { createRuntime } from '../../runtime/create-runtime.js';

import { IWebSocket } from './ws.interface.js';

import { applicationInputTypes } from './utils.js';

import { logger } from '../../logger/logger.js';

import { GeminiProvider } from '../../provider/providers/gemini.provider.js';

import { RuntimeInitializeApp } from '../../runtime/runtime-app-init.js';

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

    const runtime = createRuntime(client, {

      apps: [new RuntimeInitializeApp()],

      providers: [
        {
          name: 'default',
          provider: new GeminiProvider(),
        },
      ],
      services: []
    });

    client.runtime = runtime;

    client.on('message', async (msg: RawData) => {
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

        await runtime.receiveAndSend(data);
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

  handleMessage(client: WebSocket, message: string) {
    return client.send(message);
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
