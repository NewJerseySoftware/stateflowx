import { Injectable } from '@nestjs/common';
import { JsonRpcService } from 'src/adapters/ws/provider/json-rpc/json-rpc.service';
import { JSONRPCServerAndClient } from 'json-rpc-2.0';
import { IUserRPC } from './interface/table-rpc.interface';
import { IWebSocket } from 'src/adapters/ws/interface/ws.interface';

@Injectable()
export class UserJsonrpcService extends JsonRpcService implements IUserRPC {
  constructor(
    protected serverAndClient: JSONRPCServerAndClient,
    socket: IWebSocket,
    userModel: any,
    tableModel: any,
  ) {
    super(serverAndClient, socket, tableModel, userModel);
  }

  
}
