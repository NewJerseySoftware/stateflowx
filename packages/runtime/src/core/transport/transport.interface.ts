export interface Transport {
  start(): Promise<void>;
  stop(): Promise<void>;

  onMessage(
    handler: (clientId: string, payload: unknown) => Promise<unknown>
  ): void;

  send(clientId: string, payload: unknown): Promise<void>;
}
