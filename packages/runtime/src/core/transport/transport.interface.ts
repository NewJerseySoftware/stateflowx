export interface Transport {
  start(): Promise<void>;
  stop(): Promise<void>;

  onMessage(
    handler: (clientId: string, payload: unknown) => Promise<unknown>
  ): void;

  send(clientId: string, payload: unknown): Promise<void>;
}

// export interface Transport {
//   start(): Promise<void>;

//   stop(): Promise<void>;

//   onMessage(
//     handler: (payload: unknown) => Promise<void>
//   ): void;

//   send(
//     clientId: string,
//     payload: unknown
//   ): Promise<void>;
// }

// export interface RuntimeMessage {
//   type: string;
//   payload?: unknown;
//   clientId?: string;
//   requestId?: string;
//   metadata?: Record<string, unknown>;
// }

// export interface RuntimeResponse {
//   success: boolean;
//   payload?: unknown;
//   error?: string;
//   requestId?: string;
// }

// export interface Transport {
//   start(): Promise<void>;
//   stop(): Promise<void>;
//   onMessage(handler: (message: RuntimeMessage) => Promise<void>): void;
//   send(clientId: string, response: RuntimeResponse): Promise<void>;
// }
