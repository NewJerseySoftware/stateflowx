import { Transport } 
    from '../transport.interface.js';

export class HttpTransport implements Transport {

  private messageHandler?: (
    clientId: string,
    payload: unknown
  ) => Promise<unknown>;

  onMessage(
    handler: (clientId: string, payload: unknown) => Promise<unknown>
  ): void {
    this.messageHandler = handler;
  }

  async handleRequest(payload: unknown): Promise<unknown> {

    if (!this.messageHandler) {
      return;
    }

    return this.messageHandler('http-client', payload);

  }

  async send(): Promise<void> {}

  async start(): Promise<void> {}

  async stop(): Promise<void> {}
}
