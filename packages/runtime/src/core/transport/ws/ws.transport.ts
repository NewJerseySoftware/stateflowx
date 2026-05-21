import { randomUUID } from 'crypto';

import { RawData, WebSocketServer } from 'ws';

import { Transport } from '../transport.interface.js';

import { IWebSocket } from './ws.interface.js';

export class WebSocketTransport implements Transport {
  private clients = new Map<string, IWebSocket>();

  private messageHandler?: (
    clientId: string,
    payload: unknown
  ) => Promise<void>;

  constructor(private server: WebSocketServer) {
    this.server.on('connection', this.handleConnection.bind(this));
  }

  async start(): Promise<void> {}

  async stop(): Promise<void> {
    this.server.close();
  }

  onMessage(
    handler: (clientId: string, payload: unknown) => Promise<void>
  ): void {
    this.messageHandler = handler;
  }

  async send(clientId: string, payload: unknown): Promise<void> {
    const client = this.clients.get(clientId);

    if (!client) {
      return;
    }

    client.send(JSON.stringify(payload));
  }

  private handleConnection(client: IWebSocket) {
    client.id = randomUUID();

    this.clients.set(client.id, client);

    client.on(
      'message',

      async (raw: RawData) => {
        if (!this.messageHandler) {
          return;
        }

        try {
          const payload = JSON.parse(raw.toString());

          await this.messageHandler(client.id, payload);
        } catch (err) {
          console.error(err);
        }
      }
    );

    client.on('close', () => {
      this.clients.delete(client.id);
    });
  }
}
