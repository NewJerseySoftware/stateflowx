import { JSONRPCServer } from 'json-rpc-2.0';

import { Protocol } from '../protocol.interface.js';

export class JsonRpcProtocol implements Protocol {
  constructor(private server: JSONRPCServer = new JSONRPCServer()) {}

  addMethod(route: string, handler: Function): void {
    this.server.addMethod(route, handler as any);
  }

  async receive(payload: unknown): Promise<unknown> {
    return this.server.receive(payload as any);
  }
}
