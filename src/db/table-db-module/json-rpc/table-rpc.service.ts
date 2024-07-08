import { Injectable } from '@nestjs/common';
import { parseJsonRPCData } from 'src/ws/util/utils';
import { JsonRpcService } from 'src/ws/provider/json-rpc/json-rpc.service';
import { JSONRPCServerAndClient } from 'json-rpc-2.0';
import { ITableRPC } from './interface/table-rpc.interface';
import { ICreateTableForm } from './interface/create-table.interface';
import { IWebSocket } from 'src/ws/interface/ws.interface';

@Injectable()
export class TableJsonrpcService extends JsonRpcService implements ITableRPC {
  server: any;
  clientsMap: any;
  constructor(
    protected serverAndClient: JSONRPCServerAndClient,
    socket: IWebSocket,
    server: any,
    clientsMap: any,
    tableModel: any,
    userModel: any,
    gameModel: any,
  ) {
    super(serverAndClient, socket, tableModel, userModel, gameModel);
    this.gameModel = gameModel;
    this.server = server;
    this.clientsMap = clientsMap;
  }

  paginateTables(): void {
    this.serverAndClient.addMethod('paginateTables', (res) => {
      let response = {};
      try {
        const data = parseJsonRPCData(res[0]);
        const socketID = data.socketid;
        if (this.checkTableSocketIdError(socketID)) {
          this.result.res.success = false;
          this.result.res.data = {
            error: {
              message: `paginate tables - wrong socketid: ${data.socketid}`,
            },
          };
          return this.result;
        }
        response = this.tableController
          .getPaginatedTables(data.page, data.max)
          .then(async (data) => {
            if (data.success) {
              this.result.res.success = true;
              return this.encryptionService
                .applyFilterOne(data.data)
                .then((res: any) => {
                  this.result.res.data = res;
                  this.result.res.data['called'] = socketID;
                  this.ws.roomID = 'lobby'; // if you're paginating you're in the lobby
                  return this.result;
                });
            } else {
              return this.buildErrorResult(this.result, data.error.message);
            }
          });
        //throw new Error('Simulated MongoDB error.');
      } catch (error) {
        return this.buildErrorResult(this.result, error.message);
      }
      return response;
    });
  }

  public addTable(): any {
    this.serverAndClient.addMethod('addTable', (res) => {
      let result = {};
      try {
        const data = parseJsonRPCData(res[0]);
        const socketID = data.socketid;
        const newTable: ICreateTableForm = {
          name: data.name,
          maxClients: data.maxClients,
          type: data.type,
          uri: data.uri,
          socketid: data.socketid,
          activeTime: data.activeTime,
        };
        result = this.tableController.createTable(newTable).then((data) => {
          if (data.success) {
            this.result.res.success = true;
            const ACTIVE = data.data.game.active;
            return this.encryptionService
              .applyFilterOne(data.data.table)
              .then((res: any) => {
                this.result.res.data = res;
                this.result.res.data['called'] = socketID;
                this.result.res.data['active'] = ACTIVE;
                this.result.res.data['jtype'] = newTable.type; //join type

                // * * * * * * * * * * * * * * *
                this.encryptionService
                  .decryptStringAsync(this.result.res.data._id)
                  .then((table_id) => {
                    this.gameFlow.initGameFlow(
                      this.server,
                      this.clientsMap,
                      this.result.res.data.gameID,
                      table_id,
                      this.result.res.data.startTime,
                      30,
                    );
                  });
                // * * * * * * * * * * * * * * *

                return this.result;
              });
          } else {
            return this.buildErrorResult(this.result, data.error.message);
          }
        });
        // throw new Error('Simulated MongoDB error.');
      } catch (error) {
        return this.buildErrorResult(this.result, error.message);
      }
      return result;
    });
  }

  public getPlayers(): any {
    this.serverAndClient.addMethod('getPlayers', (res) => {
      let result = {};
      try {
        const data = parseJsonRPCData(res[0]);
        const socketID = data.socketid;
        result = this.tableController.getPlayers(data.tableid).then((data) => {
          if (data.success) {
            this.result.res.success = true;
            return (this.result.res.data = this.encryptionService
              .applyFilterOne(data.data)
              .then((res: any) => {
                this.result.res.data = res;
                this.result.res.data['called'] = socketID;
                return this.result;
              }));
          } else {
            return this.buildErrorResult(this.result, data.error.message);
          }
        });
        // throw new Error('Simulated MongoDB error.');
      } catch (error) {
        return this.buildErrorResult(this.result, error.message);
      }
      return result;
    });
  }

  public getTable(): any {
    this.serverAndClient.addMethod('getTable', (res) => {
      let result = {};
      try {
        const data = parseJsonRPCData(res[0]);
        const socketID = data.socketid;
        result = this.tableController.getTable(data.tableId).then((data) => {
          if (data.success) {
            this.result.res.success = true;
            const ACTIVE = data.data?.gameID?.active;
            const gid = data.data?.gameID._id;
            const gidEncrypt = gid?.toString();
            this.ws.gameID = gidEncrypt;
            const GAMEID = this.encryptionService.encryptString(gidEncrypt);
            //this.ws.gameID = GAMEID;
            return this.encryptionService
              .applyFilterOne(data)
              .then((res: any) => {
                this.ws.roomID = res._id;
                this.ws.gameID = GAMEID;
                this.result.res = res;
                if (this.result.res.data) {
                  this.result.res.data['called'] = socketID;
                  this.result.res.data['getTime'] = Date.now().toString();
                  this.result.res.data['active'] = ACTIVE;
                  this.result.res.data['gameID'] = GAMEID;
                }
                if (data.data?.gameID?.seats?.size > 0) {
                  this.result.res.data['seats'] = true;
                }else{
                  this.result.res.data['seats'] = false;
                }
                return this.result;
              });
          } else {
            return this.buildErrorResult(this.result, data.error.message);
          }
        });
      } catch (error) {
        return this.buildErrorResult(this.result, error.message);
      }
      return result;
    });
  }

  /* eligable for db cleanup on join */
  public joinTable(): any {
    this.serverAndClient.addMethod('joinTable', (res) => {
      let result = {};
      try {
        const data = parseJsonRPCData(res[0]);
        // const starttime = data.starttime;
        const socketID = data.socketid;
        const tableid = data.tableid;
        const player = data.player;

        if (this.checkTableSocketIdError(data.socketid)) {
          this.result.res.success = false;
          this.result.res.data = {
            error: { message: `join table - wrong socketid: ${data.socketid}` },
          };
          return this.result;
        }

        if (
          data &&
          socketID &&
          tableid &&
          typeof player === 'boolean'
        ) {
          result = this.tableController
            .joinTable(tableid, socketID, player)
            .then((data) => {
              if (data.success) {
                this.ws.roomID = tableid; // SET SOCKET roomID
                this.result.res.success = true;
                const ACTIVE = data.data.active;
                const GAMEID = data.data.doc.gameID;
                return this.encryptionService
                  .applyFilterOne(data.data)
                  .then(async (res: any) => {
                    this.result.res.data = res;
                    this.result.res.data['called'] = socketID;
                    this.result.res.data['_id'] = this.ws.roomID;
                    this.result.res.data.doc._id = this.ws.roomID;
                    this.result.res.data['active'] = ACTIVE;
                    const gid = GAMEID._id.toString();
                    // this.ws.gameID = gid; // <-- if you're at join you already called getTable
                    this.result.res.data['startTime'] =
                      this.result.res.data.doc.startTime;
                    this.result.res.data['getTime'] = Date.now().toString();
                    delete this.result.res.data.doc;

                    //joined table, eligable for cleanup
                    this.ws.eligableForDBCleanup = true;

                    return this.result;
                  });
              } else {
                return this.buildErrorResult(
                  this.result,
                  data.error.message,
                  data.error.id,
                );
              }
            });
        }
      } catch (error) {
        return this.buildErrorResult(this.result, error.message);
      }
      return result;
    });
  }

  public getStatus(): any {
    this.serverAndClient.addMethod('getStatus', (res) => {
      try {
        const data = parseJsonRPCData(res[0]);
        const socketID = data.socketid;
        if (this.checkTableSocketIdError(socketID)) {
          this.result.res.success = false;
          this.result.res.data = {
            error: {
              message: `get status - wrong socketid: ${data.socketid}`,
            },
          };
        } else {
          this.result.res.success = true;
          const userDBIDENCRYPTED = this.encryptionService.encryptString(
            this.ws.userDBID,
          );
          this.result.res.data = {
            socketid: this.ws.id,
            roomID: this.ws.roomID,
            userDBID: userDBIDENCRYPTED,
            gameID: this.ws.gameID || null,
            seat: this.ws.seat, // NOT USING SO FAR......
          };
          return this.result;
        }
      } catch (error) {
        return this.buildErrorResult(this.result, error.message);
      }
    });
  }

  public leaveTable(): any {
    this.serverAndClient.addMethod('leaveTable', (res) => {
      let result = {};
      try {
        const data = parseJsonRPCData(res[0]);
        const socketID = data.socketid;
        if (this.checkTableSocketIdError(socketID)) {
          this.result.res.success = false;
          this.result.res.data = {
            error: {
              message: `leave table - wrong socketid: ${data.socketid}`,
            },
          };
          return this.result;
        } else {
          result = this.tableController
            .leaveTable(this.ws.gameID, this.ws.id, data.tableid)
            .then(async (data) => {
              if (data.success) {
                this.result.res.success = true;
                this.result.res.data = data;
                this.result.res.data['called'] = socketID;
                await this.gameDBController.removeSeatMapValue(
                  this.ws.gameID,
                  this.ws.id,
                );
                return this.result;
              } else {
                return this.buildErrorResult(
                  this.result,
                  data.error.message,
                  data.error.id,
                );
              }
            });
        }
      } catch (error) {
        return this.buildErrorResult(this.result, error.message);
      }
      return result;
    });
  }

  async getSeat(map: any) {
    for (const [key, value] of map.entries()) {
      if (value === this.ws.id) {
        return key;
      }
    }
    return undefined;
  }
}
