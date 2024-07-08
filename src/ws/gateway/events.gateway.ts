import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import {
  JSONRPCClient,
  JSONRPCServer,
  JSONRPCServerAndClient,
} from 'json-rpc-2.0';
import { Server, WebSocket } from 'ws';
import { UUIDService } from 'src/shared/services/uuid/uuid.service';
import { applicationInputTypes, isJsonString } from 'src/ws/util/utils';
import { JsonRpcService } from '../provider/json-rpc/json-rpc.service';
import { IWebSocket } from '../interface/ws.interface';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { TableDocument } from 'src/db/table-db-module/resource/table/table.schema';
import { TableJsonrpcService } from 'src/db/table-db-module/json-rpc/table-rpc.service';
import { BjJsonrpcService } from 'src/blackjack-game/json-rpc/bj-jsonrpc.service';
import { AppConfigService } from 'src/config/config.service';
import { UserDocument } from 'src/db/user-db-module/resource/user/user.schema';
import { GameDocument } from 'src/db/game-db-module/resource/game/game.schema';
import {
  removeSocketIdFromPlayersWatchersArray,
  removeSeatMapValue,
} from './cleanup';
import { EncryptionService } from 'src/shared/services/encryption/encryption.service';
import { isObject } from 'class-validator';
//import { MessageService } from 'src/blackjack-game/message/message';

@WebSocketGateway()
export default class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server & { clients: Set<IWebSocket> };
  clientsMap: Map<string, IWebSocket> = new Map<string, IWebSocket>();
  messageType: boolean;
  serverAndClient: JSONRPCServerAndClient;
  nextClientId: number;
  maxDataLength: number = 1500;

  constructor(
    private tableRPC: TableJsonrpcService,
    private blackJackRPC: BjJsonrpcService,
    private jsonRpcService: JsonRpcService,
    private uuidService: UUIDService,
    private appConfigService: AppConfigService,
    @Inject(EncryptionService)
    private readonly encryptionService: EncryptionService,
    @Inject('TABLE_MODEL') readonly tableModel: Model<TableDocument>,
    @Inject('USER_MODEL') readonly userModel: Model<UserDocument>,
    @Inject('GAME_MODEL') readonly gameModel: Model<GameDocument>,
  ) {
    this.nextClientId = 1;
  }

  handleConnection(@ConnectedSocket() clientWS: IWebSocket, request: any) {
    //this.ws = ws;
    this.doSomethingWithTheRequest(request);
    const newID = this.uuidService.getUniqueV4ID() + '-' + this.nextClientId;
    clientWS.id = newID;
    clientWS.roomID = 'lobby'; // default
    clientWS.seat = '0'; // default
    clientWS.gameID = ''; // ALWAYS DECRYPTED STORED HERE
    this.clientsMap.set(newID, clientWS);
    this.nextClientId++;
    console.log(`Client connected with ID: ${clientWS.id}`);

    clientWS.jsonSC = new JSONRPCServerAndClient(
      new JSONRPCServer(),
      new JSONRPCClient((request) => {
        const data = JSON.stringify(request);
        try {
          clientWS.send(data);
          return Promise.resolve();
        } catch (error) {
          return Promise.reject(error);
        }
      }),
    );

    clientWS.onmessage = (event: any) => {
      try {
        if (this.isValidObject(event, clientWS)) {
          //check for ping
          const checkPing = JSON.parse(event.data);
          if (checkPing.type === 'ping') {
            clientWS.send(JSON.stringify({ type: 'pong' }));
          } else {
            if (isJsonString(event.data, clientWS)) {
              if (JSON.parse(event.data).id) {
                if (
                  this.appConfigService
                    .getConfig()
                    .BROADCAST_EVENTS.table.includes(
                      JSON.parse(event.data).method,
                    ) ||
                  this.appConfigService
                    .getConfig()
                    .BROADCAST_EVENTS.game.includes(
                      JSON.parse(event.data).method,
                    ) ||
                  this.appConfigService
                    .getConfig()
                    .BROADCAST_EVENTS.seat.includes(
                      JSON.parse(event.data).method,
                    )
                ) {
                  this.responseToALLClients(event.data); // BROADCAST
                  console.log(event.data);
                } else {
                  this.responseToClient(clientWS.jsonSC, event.data);
                }
              } else {
                clientWS.send(
                  JSON.stringify({
                    error: { message: 'json-rpc object missing id field' },
                  }),
                );
              }
            }
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    /* core services */
    this.jsonRpcService = new JsonRpcService(
      clientWS.jsonSC,
      clientWS,
      this.tableModel,
      this.userModel,
      this.gameModel,
    );
    this.jsonRpcService.addUserConnection(this.uuidService.getUniqueV4ID());

    /* tables */
    this.tableRPC = new TableJsonrpcService(
      clientWS.jsonSC,
      clientWS,
      this.server,
      this.clientsMap,
      this.tableModel,
      this.userModel,
      this.gameModel,
    );
    this.tableRPC.addTable();
    this.tableRPC.getTable();
    this.tableRPC.joinTable();
    this.tableRPC.paginateTables();
    this.tableRPC.leaveTable();
    this.tableRPC.getPlayers();
    this.tableRPC.getStatus();

    /* blackjack game */
    this.blackJackRPC = new BjJsonrpcService(
      clientWS.jsonSC,
      clientWS,
      this.tableModel,
      this.userModel,
      this.gameModel,
    );
    this.blackJackRPC.addTest();
    this.blackJackRPC.getSeats();
    this.blackJackRPC.addSeat();
    this.blackJackRPC.getGameActiveStatus();
  }

  handleDisconnect(@ConnectedSocket() clientWS: IWebSocket) {
    if (clientWS.roomID !== 'lobby') {
      //console.log('clientWS.roomID !== lobby');
      //cleanup db eligable for cleanup set when joins table
      if (clientWS.eligableForDBCleanup) {
        this.encryptionService
          .decryptStringAsync(clientWS.roomID)
          .then(async (roomId) => {
            await removeSocketIdFromPlayersWatchersArray(
              clientWS.id,
              roomId,
              this.tableModel,
            );
          });

        this.encryptionService
          .decryptStringAsync(clientWS.gameID)
          .then(async (gameID) => {
            await removeSeatMapValue(gameID, clientWS.id, this.gameModel);
          });
      }
    }

    console.log(clientWS.id + ' ... disconnected');
    this.nextClientId--;
    this.clientsMap.delete(clientWS.id);
  }

  afterInit(server: any) {
    console.log('WebSocketGateway initialized');
    // NATIVE SOCKET NOT HANDLECONNECTION
    // this.server.addListener('headers', (data:any) => {
    //   console.log('headers');
    // });
    // this.server.addListener('connection',(ws:IWebSocket)=>{
    //   console.log('connection: ' + ws.id);
    // });
  }
  doSomethingWithTheRequest(req: any) {
    const clientIP = req.socket.remoteAddress;
    console.log('clientIP: ' + clientIP);
  }

  responseToClient(jsonSC: any, message: any): void {
    jsonSC.receiveAndSend(JSON.parse(message));
  }
  responseToALLClients(message: any): void {
    this.server.clients.forEach((client: IWebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        this.responseToClient(client.jsonSC, message);
      }
    });
  }

  // my goal is extra paranoid :)
  isValidObject(value: any, client: any): boolean {
    if (applicationInputTypes(value.data)) {
      if (typeof value.data === 'string') {
        const len = value.data.length;
        if (len <= this.maxDataLength) {
          return isObject(value); // success
        } else {
          client.terminate();
          console.log(
            `data length over ${this.maxDataLength} disconnecting client: ${client.id}`,
          );
        }
      }
      client.terminate();
      console.log(`data input error -disconnecting client: ${client.id}`);
      return false;
    } else {
      client.terminate();
      console.log(
        `data input error wrong type -disconnecting client: ${client.id}`,
      );
    }
  }
}

// Connected (press CTRL+C to quit)
// > {"jsonrpc":"2.0", "method":"add", "params":[{"data": {"x":"1","y":"2"}}, "latest"], "id":1}
// < {"jsonrpc":"2.0","id":1,"result":{"true":3}}
// > {"jsonrpc":"2.0", "method":"add", "params":[{"data": {"x":"1","y":"2"}}, "latest"], "ids":1}
// < {"error":{"message":"id is missing from json-rpc"}}
// Disconnected (code: 1006, reason: "")
// burtsnyder@Burts-Mac-mini a-ws-test-project % wscat -c ws://localhost:3000
// Connected (press CTRL+C to quit)
// > {"jsonrpc":"2.0", "method":"add", "params":[{"data": {"x":"1","y":"2"}}, "latest"], "ids":1}
// < {"error":{"message":"id is missing from json-rpc call"}}
// > {"jsonrpc":"2.0", "method":"add", "params":[{"data": {"x":"1","y":"2"}}, "latest"], "id":1}
// < {"jsonrpc":"2.0","id":1,"result":{"true":3}}
// > {"jsonrpc":"2.0", "method":"add", "params":[{"data": {"x":"1","y":"2"}}, "latest"], "id":}
// < {"error":{"message":"Unexpected token } in JSON at position 89"}}
// > {"jsonrpc":"2.0", "method":"add", "params":[{"data": {"x":"1","y":"2"}}, "latest"], "id"}
// < {"error":{"message":"Unexpected token } in JSON at position 88"}}
// Disconnected (code: 1006, reason: "")
// burtsnyder@Burts-Mac-mini a-ws-test-project % wscat -c ws://localhost:3000
// Connected (press CTRL+C to quit)
// > {"jsonrpc":"2.0", "method":"add", "params":[{"data": {"x":"1","y":"2"}}, "latest"], "ids":1}
// < {"error":{"message":"json-rpc object missing id field"}}
// > {"jsonrpc":"2.0", "method":"add", "params":[{"data": {"x":"1","y":"2"}}, "latest"], "id":1}
// < {"jsonrpc":"2.0","id":1,"result":{"true":3}}
// > {"jsonrpc":"2.0", "method":"add", "params":[{"data": {"x":"1","y":"2"}}, "latest"], "id":""}
// < {"error":{"message":"json-rpc object missing id field"}}
// > {"jsonrpc":"2.0", "method":"add", "params":[{"data": {"x":"1","y":"2"}}, "latest"], "id":.}
// < {"error":{"message":"Unexpected token . in JSON at position 89"}}
// > {"jsonrpc":"2.0", "method":"add", "params":[{"data": {"x":"1","y":"2"}}, "latest"], "id":"puto"}
// < {"jsonrpc":"2.0","id":"puto","result":{"true":3}}
