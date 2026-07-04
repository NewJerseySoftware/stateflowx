import { TransportCapabilities } from "./transport-capabilities.interface.js";

export interface Transport {

  readonly capabilities: TransportCapabilities;
  
  start(): Promise<void>;

  stop(): Promise<void>;

  onMessage(
    handler: (clientId: string, payload: unknown) => Promise<unknown>
  ): void;

  send(clientId: string, payload: unknown): Promise<void>;
}
