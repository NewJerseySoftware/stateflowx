import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { isObject } from 'class-validator';
import { Server } from 'ws';

import { createRuntime } from '../../../core/runtime/runtime.factory';
import { IWebSocket } from '../interface/ws.interface';
import { applicationInputTypes } from '../util/utils';

@WebSocketGateway()
export default class EventsGateway
  implements OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect {

  @WebSocketServer()
  server!: Server & {
    clients: Set<IWebSocket>;
  };

  clientsMap = new Map<string, IWebSocket>();

  maxDataLength = 1500;

  handleConnection(client: IWebSocket) {

    console.log('Client connected');

    const runtime = createRuntime(client);

    client.jsonSC = runtime;

    client.on('message', (msg: any) => {

      console.log('incoming:', msg.toString());

      try {

        const data = JSON.parse(msg.toString());

        runtime.receiveAndSend(data);

      } catch (err) {

        console.error('Invalid JSON:', err);
      }
    });
  }

  handleMessage(
    client: IWebSocket,
    payload: any,
  ) {

    client.jsonSC.receiveAndSend(payload);
  }

  handleDisconnect(
    @ConnectedSocket()
    clientWS: IWebSocket,
  ) {

    console.log(`${clientWS.id} disconnected`);

    this.clientsMap.delete(clientWS.id);
  }

  afterInit() {

    console.log('WebSocketGateway initialized');
  }

  responseToClient(
    jsonSC: any,
    message: any,
  ): void {

    jsonSC.receiveAndSend(JSON.parse(message));
  }

  responseToALLClients(message: any): void {

    this.server.clients.forEach((client: IWebSocket) => {

      if (client.readyState === 1) {

        this.responseToClient(
          client.jsonSC,
          message,
        );
      }
    });
  }

  isValidObject(
    value: any,
    client: IWebSocket,
  ): boolean {

    if (applicationInputTypes(value.data)) {

      if (typeof value.data === 'string') {

        const len = value.data.length;

        if (len <= this.maxDataLength) {

          return isObject(value);
        }

        client.terminate();

        console.log(
          `data length over ${this.maxDataLength} disconnecting client: ${client.id}`,
        );

        return false;
      }

      client.terminate();

      console.log(
        `data input error disconnecting client: ${client.id}`,
      );

      return false;
    }

    client.terminate();

    console.log(
      `data input wrong type disconnecting client: ${client.id}`,
    );

    return false;
  }
}


// import {
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   OnGatewayInit,
//   WebSocketGateway,
//   WebSocketServer,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import {
//   JSONRPCClient,
//   JSONRPCServer,
//   JSONRPCServerAndClient,
// } from 'json-rpc-2.0';
// import { Server, WebSocket } from 'ws';
// import { applicationInputTypes, isJsonString } from '../util/utils';
// import { IWebSocket } from '../interface/ws.interface';
// import { isObject } from 'class-validator';
// import { PingPongJsonrpcService } from '../../../examples/ping-pong/json-rpc/ping-pong.jsonrpc.service';
// import { jsonRpcAdapter } from '../../../adapters/json-rpc/jsonrpc.adapter';
// import { InMemoryDB } from '../../../adapters/db/in-memory.db';
// import { bootstrapRuntime } from '../../../core/runtime/bootstrap';
// import { PingPongApp } from '../../../demo/apps/ping-pong/ping-pong.app';

// @WebSocketGateway()
// export default class EventsGateway
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
// {
//   @WebSocketServer()
//   server!: Server & { clients: Set<IWebSocket> };
//   clientsMap: Map<string, IWebSocket> = new Map<string, IWebSocket>();
//   messageType: boolean;
//   serverAndClient: JSONRPCServerAndClient;
//   nextClientId: number;
//   maxDataLength: number = 1500;
//   pingPongRPC: PingPongJsonrpcService;

//   constructor() {}

//   handleConnection(client: any) {
//     console.log('Client connected');

//     const jsonSC = new JSONRPCServerAndClient(
//       new JSONRPCServer(),
//       new JSONRPCClient((request) => {
//         client.send(JSON.stringify(request));
//       }),
//     );

//     client.jsonSC = jsonSC;

//     // const pingPongRPC = new PingPongJsonrpcService(jsonSC, client);
//     // pingPongRPC.register();
//     const runtimeConfig = {
//       adapters: [jsonRpcAdapter],
//       db: new InMemoryDB(),
//       transport: {
//         jsonrpc: jsonSC.server,
//       },
//     };
//     bootstrapRuntime(jsonSC.server, [PingPongApp], runtimeConfig);

//     client.on('message', (msg: any) => {
//       console.log('incoming:', msg.toString());

//       try {
//         const data = JSON.parse(msg.toString());
//         jsonSC.receiveAndSend(data);
//       } catch (err) {
//         console.error('Invalid JSON:', err);
//       }
//     });
//   }

//   handleMessage(client: any, payload: any) {
//     client.jsonSC.receiveAndSend(payload);
//   }

//   handleDisconnect(@ConnectedSocket() clientWS: IWebSocket) {
//     if (clientWS.roomID !== 'lobby') {
//       //console.log('clientWS.roomID !== lobby');
//       //cleanup db eligable for cleanup set when joins table
//       if (clientWS.eligableForDBCleanup) {
//         // this.encryptionService
//         //   .decryptStringAsync(clientWS.roomID)
//         //   .then(async (roomId) => {
//         //     // todo: shouldn't be here...
//         //     // await removeSocketIdFromPlayersWatchersArray(
//         //     //   clientWS.id,
//         //     //   roomId,
//         //     //   this.tableModel,
//         //     // );
//         //   });
//         // todo: shouldn't be here... should be in game provider or game flow
//         // this.encryptionService
//         //   .decryptStringAsync(clientWS.gameID)
//         //   .then(async (gameID) => {
//         //     await removeSeatMapValue(gameID, clientWS.id, this.gameModel);
//         //   });
//       }
//     }

//     console.log(clientWS.id + ' ... disconnected');
//     this.nextClientId--;
//     this.clientsMap.delete(clientWS.id);
//   }

//   afterInit(server: any) {
//     console.log('WebSocketGateway initialized');
//     // NATIVE SOCKET NOT HANDLECONNECTION
//     // this.server.addListener('headers', (data:any) => {
//     //   console.log('headers');
//     // });
//     // this.server.addListener('connection',(ws:IWebSocket)=>{
//     //   console.log('connection: ' + ws.id);
//     // });
//   }
//   doSomethingWithTheRequest(req: any) {
//     const clientIP = req.socket.remoteAddress;
//     console.log('clientIP: ' + clientIP);
//   }

//   responseToClient(jsonSC: any, message: any): void {
//     jsonSC.receiveAndSend(JSON.parse(message));
//   }
//   responseToALLClients(message: any): void {
//     this.server.clients.forEach((client: IWebSocket) => {
//       if (client.readyState === WebSocket.OPEN) {
//         this.responseToClient(client.jsonSC, message);
//       }
//     });
//   }

//   isValidObject(value: any, client: any): boolean {
//     if (applicationInputTypes(value.data)) {
//       if (typeof value.data === 'string') {
//         const len = value.data.length;
//         if (len <= this.maxDataLength) {
//           return isObject(value); // success
//         } else {
//           client.terminate();
//           console.log(
//             `data length over ${this.maxDataLength} disconnecting client: ${client.id}`,
//           );
//         }
//       }
//       client.terminate();
//       console.log(`data input error -disconnecting client: ${client.id}`);
//       return false;
//     } else {
//       client.terminate();
//       console.log(
//         `data input error wrong type -disconnecting client: ${client.id}`,
//       );
//     }
//   }
// }
