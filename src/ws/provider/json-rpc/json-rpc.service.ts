import { Injectable } from '@nestjs/common';
import { JSONRPCServerAndClient } from 'json-rpc-2.0';
import { parseJsonRPCData } from 'src/ws/util/utils';
import { UUIDService } from 'src/shared/services/uuid/uuid.service';
import { ConnectionService } from '../connection/connection.service';
import { CoreServices } from 'src/ws/core/core';
import { IWebSocket } from 'src/ws/interface/ws.interface';
import { HttpProvider } from 'src/shared/services/http/http-provider';
import { TableController } from 'src/db/table-db-module/resource/table/table.controller';
import { TableService } from 'src/db/table-db-module/resource/table/table.service';
import { IResult } from 'src/ws/core/result.interface';
import { EncryptionService } from 'src/shared/services/encryption/encryption.service';
import { AppConfigService } from 'src/config/config.service';
import { UserController } from 'src/db/user-db-module/resource/user/user.controller';
import { UserService } from 'src/db/user-db-module/resource/user/user.service';
import { GameDBController } from 'src/db/game-db-module/resource/game/gameDB.controller';
import { GameDBService } from 'src/db/game-db-module/resource/game/gameDB.service';
import { GameFlow } from 'src/blackjack-game/game-flow/game-flow';
@Injectable()
export class JsonRpcService extends CoreServices {
  public ws: IWebSocket;
  serverClient: JSONRPCServerAndClient;
  socket: IWebSocket;
  tableModel: any;
  userModel: any;
  gameModel?: any;

  result: IResult = {
    res: {
      success: false,
      data: undefined,
    },
  };

  constructor(
    protected serverAndClient: JSONRPCServerAndClient,
    socket: any,
    tableModel: any,
    userModel: any,
    gameModel?: any,
  ) {
    super(
      new UUIDService(),
      new ConnectionService(),
      new HttpProvider(),
      new TableController(
        new TableService(
          tableModel,
          gameModel,
          new EncryptionService(new AppConfigService()),
        ),
      ),
      new UserController(new UserService(tableModel)),
      new GameDBController(
        new GameDBService(
          gameModel,
          tableModel,
          new EncryptionService(new AppConfigService()),
        ),
      ),
      new EncryptionService(new AppConfigService()),
      new GameFlow(
        new TableService(
          tableModel,
          gameModel,
          new EncryptionService(new AppConfigService()),
        ),
        new GameDBService(
          gameModel,
          tableModel,
          new EncryptionService(new AppConfigService()),
        ),
      ),
    );
    this.ws = <IWebSocket>socket;
    this.serverAndClient = serverAndClient;
    this.socket = socket;
    this.tableModel = tableModel;
    this.userModel = userModel;
  }

  public checkTableSocketIdError(socketIdFromUI: string): boolean {
    return socketIdFromUI !== this.ws.id;
  }

  public addUserConnection(_id: string): any {
    this.serverAndClient.addMethod('userInitialConnection', (res) => {
      let result = {};
      try {
        const data = parseJsonRPCData(res[0]);
        const wsconnected = data.wsconnected;
        const previouslyConnected = wsconnected === 'false' ? false : true;
        if (!previouslyConnected) {
          result = {
            success: true,
            data: { sid: this.ws.id },
          };
          this.createDefaultGuestUser();
        }
      } catch (e) {
        result = {
          success: false,
          data: e instanceof Error ? e.message : String(e),
        };
      }
      return result;
    });
  }

  /*
   * each connection get's a default user...
   */
  async createDefaultGuestUser(): Promise<any> {
    let guestUser = {
      name: 'Guest',
      roomID: 'lobby',
      gameID: '',
      registered: false,
      socketid: this.ws.id,
    };
    try {
      //throw new NotFoundException(`User with ID TESTING not found.`);
      const newUser = new this.userModel(guestUser);
      const savedUser = await newUser.save();
      this.ws.userDBID = savedUser._id.toString();
      return { success: true, data: { user: savedUser } };
    } catch (error) {
      console.log(error);
    }
  }

  buildErrorResult(result: any, error: any, id?: any) {
    result.res.success = false;
    result.res.data = {
      error: { message: error, id: id },
    };
    return result;
  }
}
