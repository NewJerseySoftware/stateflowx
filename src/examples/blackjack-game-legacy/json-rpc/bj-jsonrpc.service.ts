import { Injectable } from '@nestjs/common';
import { parseJsonRPCData } from 'src/adapters/ws/util/utils';
import { JsonRpcService } from 'src/adapters/ws/provider/json-rpc/json-rpc.service';
import { JSONRPCServerAndClient } from 'json-rpc-2.0';
import { IWebSocket } from 'src/adapters/ws/interface/ws.interface';
import { IGAME } from '../interface/game-controller.interface';
@Injectable()
export class BjJsonrpcService extends JsonRpcService implements IGAME {
  constructor(
    protected serverAndClient: JSONRPCServerAndClient,
    ws: IWebSocket,
    tableModel: any,
    userModel: any,
    gameModel: any,
  ) {
    super(serverAndClient, ws, tableModel, userModel, gameModel);
  }

  getGameActiveStatus(): any {
    this.serverAndClient.addMethod('getGameActiveStatus', (res) => {
      let result = {};
      try {
        const data = parseJsonRPCData(res[0]);
        const tableID = data.tableID;
        // result = this.gameDBController
        //   .getGameFromTableID(tableID)
        //   .then(async (data) => {
        //     const gameID = data?.game?.gameID._id.toString();
        //     const data_1 = await this.gameDBController.getGameActiveStatus(
        //       gameID,
        //     );
        //     if (data_1.success) {
        //       return this.encryptionService
        //         .applyFilterOne(data_1)
        //         .then((res: any) => {
        //           this.result.res.success = true;
        //           this.result.res.data = res.data;
        //           return this.result;
        //         });
        //     } else {
        //       return this.buildErrorResult(this.result, data_1.error.message);
        //     }
        //   });
      } catch (error) {
        // return this.buildErrorResult(this.result, error.message);
      }
      return result;
    });
  }

  addSeat(): any {
    this.serverAndClient.addMethod('addSeat', (res) => {
      let result = {};
      try {
        const data = parseJsonRPCData(res[0]);
        //const wsGameID = this.encryptionService.encryptString(this.ws.gameID);
        const dataGameID = data.gameID;
        
        // this.isMismatchAsync1(wsGameID, dataGameID).then((res) => {
        //   if (!res) {
        //     this.result.res.success = true;
        //     this.result.res.data = { mismatch: true };
        //     return this.result;
        //   }
        // });

        // result = this.gameDBController
        //   .addSeat(dataGameID, data.seat, data.socketid)
        //   .then((data) => {
        //     console.log('...');
        //     console.log(this.ws.id);
        //     console.log('...');
        //     console.log(data);
        //     if (data.success) {
        //       return this.encryptionService
        //         .applyFilterOne(data.data)
        //         .then((res: any) => {
        //           this.result.res.data = res;
        //           this.result.res.data['called'] = this.ws.id;
        //           return this.result;
        //         });
        //     } else {
        //       return this.buildErrorResult(this.result, data.error.message);
        //     }
        //   });
      } catch (error) {
        //return this.buildErrorResult(this.result, error.message);
      }
      return result;
    });
  }

  public getSeats(): any {
    this.serverAndClient.addMethod('getSeats', (res) => {
      let result = {};
      try {
        const data = parseJsonRPCData(res[0]);
        // const socketID = data.socketid;

        // CHECK MISMATCH
        const dataWSGameID: string = this.ws.gameID;
        const dataGameID: string = data.gameID;
        this.isMismatchAsync1(dataWSGameID, dataGameID).then((res) => {
          if (!res) {
            this.result.res.success = true;
            this.result.res.data = { mismatch: true };
            return this.result;
          }
        });

        // result = this.gameDBController.getSeats(data.gameID).then((data) => {
        //   if (data.success) {
        //     this.result.res.success = true;
        //     return (this.result.res.data = this.encryptionService
        //       .applyFilterOne(data.data)
        //       .then((res: any) => {
        //         this.result.res.data = res;
        //         this.result.res.data['called'] = this.ws.id;
        //         return this.result;
        //       }));
        //   } else {
        //     return this.buildErrorResult(this.result, data.error.message);
        //   }
        // });
        // throw new Error('Simulated MongoDB error.');
      } catch (error) {
        //return this.buildErrorResult(this.result, error.message);
      }
      return result;
    });
  }

  public addTest(): any {
    console.log('readyState: ' + this.ws.readyState);
    console.log('OPEN: ' + this.ws.OPEN);
    console.log('url: ' + this.ws.url);
    this.serverAndClient.addMethod('test', (res) => {
      let result = {};
      try {
        const data = parseJsonRPCData(res[0]);
        const calc = Number(data.x) + Number(data.y);
        result = { true: calc };
      } catch (e) {
        //result = { false: e.message };
      }
      return result;
    });
  }

  deal(): void {
    console.log('deal');
  }
  shuffle(): void {
    console.log('shuffle');
  }

  // isMismatch1(value1: any, value2: any): boolean {
  //   const v1 = this.encryptionService.decryptString(value1).trim();
  //   const v2 = this.encryptionService.decryptString(value2).trim();
  //   console.log('v1: ' + v1);
  //   console.log('v2: ' + v2);
  //   console.log('typeof v2: ' + typeof v2);
  //   const mismatch = v1 !== v2;
  //   return mismatch;
  // }

  async isMismatchAsync1(value1: any, value2: any): Promise<boolean> {
    return new Promise(async (resolve) => {
      // const v1 = await this.encryptionService.decryptStringAsync(value1);
      // const v2 = await this.encryptionService.decryptStringAsync(value2);
      // console.log('v1: ' + v1);
      // console.log('v2: ' + v2);
      // console.log('typeof v2: ' + typeof v2);
      // resolve(v1 !== v2);
    });
  }
}
