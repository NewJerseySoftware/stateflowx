import { JSONRPCServer } from 'json-rpc-2.0';

export class JsonRpcProtocol {

  constructor(
    private readonly jsonrpc: JSONRPCServer,
  ) {}

  addMethod(
    route: string,
    handler: Function,
  ) {

    this.jsonrpc.addMethod(
      route,
      handler as any,
    );
  }

  async receive(
    payload: any,
  ) {

    return this.jsonrpc.receive(
      payload,
    );
  }
}