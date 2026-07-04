import { TransportCapabilities } from '../transport-capabilities.interface.js';
import { Transport }
  from '../transport.interface.js';

export class HttpTransport implements Transport {

  readonly capabilities: TransportCapabilities = {
    duplex: false,
    supportsEvents: false,
    persistent: false,
  };

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

    // if (!this.messageHandler) {
    //   return;
    // }
    if (!this.messageHandler) {
      throw new Error("HTTP transport has no message handler registered.");
    }

    return this.messageHandler('http-client', payload);

  }

  async send(): Promise<void> { }

  async start(): Promise<void> { }

  async stop(): Promise<void> { }
}
