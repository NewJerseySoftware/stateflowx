import { Inject, Injectable } from '@nestjs/common';
import { GameDBService } from 'src/db/game-db-module/resource/game/gameDB.service';
import { TableService } from 'src/db/table-db-module/resource/table/table.service';
import { IWebSocket } from 'src/adapters/ws/interface/ws.interface';
import { WebSocket } from 'ws';

@Injectable()
export class Blackjack {
  protected gameID: string;
  protected tableID: string; // roomID
  protected startTime: string;
  protected isActive: boolean;
  protected countdownTimer: NodeJS.Timer | null;
  protected activeTime: number;
  protected server: any;
  protected clientsMap: any;
  protected gameModel: any;

  playerTurnTime: number = 10;
  seats: string[];

  constructor(
    @Inject(TableService) readonly tableService: TableService,
    @Inject(GameDBService) readonly gameDBService: GameDBService,
  ) {
    this.isActive = false;
    this.countdownTimer = null;
    //this.activeTime = 90;
  }

  initGame(
    id: string,
    tableID: string,
    startTime: string,
    server: any,
    clientsMap: any,
    activeTime: any,
  ) {
    this.gameID = id;
    this.tableID = tableID;
    this.startTime = startTime;
    this.server = server;
    this.clientsMap = clientsMap;
    this.activeTime = activeTime;

    this.startGameStartCountdown(activeTime).then(async () => {
      try {
        this.seats = await this.getSeats();
        if (this.seats.length > 0) {
          // * * *
          const socketId = this.seats.shift();
          this.sendActiveToClient(socketId);
          // console.log('Popped:', socketId);
        }
        this.playerTurnCountdown();
      } catch (error) {
        console.log('error starting countdown: ' + error);
      }
    });
  }

  sendMessageToSpecificClient(clientId: string, message: string) {
    const client = this.clientsMap.get(clientId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }

  broadcastMessageToSeated(message: string, seats: string[]): void {
    seats.forEach((socket_id) => {
      this.sendMessageToSpecificClient(socket_id, message);
    });
  }

  broadcastAppMessage(message: string): void {
    this.server.clients.forEach((client: IWebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  broadcastTableMessage(message: string, tableID: string): void {
    this.clientsMap.forEach((client: IWebSocket, key: any) => {
      if (client.readyState === WebSocket.OPEN) {
        this.gameDBService.encryptionService
          .decryptStringAsync(client.roomID)
          .then((res) => {
            if (tableID === res) {
              client.send(message);
            }
          });
      }
    });
  }

  /* game flow */
  sendActiveToClient(socketid: string) {
    //const socketid = this.seats.pop();
    const message = `{"success":true,"type":"activePlayer","id":"${socketid}","gameID":"${this.gameID}"}`;
    // console.log(message);
    this.broadcastTableMessage(message, this.tableID);
  }

  async getSeats(): Promise<any> {
    try {
      // const gameObj = await this.tableService.getSeatsByGameId(this.gameID);
      const gameObj = await this.gameDBService.getSeatsByGameId(this.gameID);
      return this.sortSeatMapConvertToArray(gameObj.data.game.seats);
    } catch (error) {
      console.log('error getting game.seats: ' + error);
    }
  }

  sortSeatMapConvertToArray(seats: Map<string, string>): string[] {
    return Array.from(seats.entries())
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map((entry) => entry[1]);
  }

  startGameStartCountdown(activeTime: number): Promise<void> {
    return new Promise((resolve) => {
      this.countdownTimer = setInterval(() => {
        activeTime--;
        // console.log(activeTime);
        if (activeTime === 0) {
          this.isActive = true;
          this.gameDBService.encryptionService
            .decryptStringAsync(this.gameID)
            .then((gid) => {
              this.gameDBService
                .internalUpdateGameActive(gid, true)
                .then(() => {
                  console.log(`Game ${gid} is now active!`);
                  clearInterval(this.countdownTimer);
                  this.countdownTimer = null;
                  this.broadcastTableMessage(
                    '{"type":"startGameTimer", "success":true}',
                    this.tableID,
                  );
                  resolve();
                });
            });
        }
      }, 1000);
    });
  }

  async playerTurnCountdown(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.countdownTimer = setInterval(async () => {
        this.playerTurnTime--;
        //console.log(this.playerTurnTime);
        if (this.playerTurnTime === 0) {
          clearInterval(this.countdownTimer);
          this.countdownTimer = null;
          this.playerTurnTime = 10;
          resolve();
        }
      }, 1000);
    });
    const incomingSockets: any = await this.getSeats();
    if (this.seats?.length === 0 && incomingSockets?.length > 0) {
      this.seats = await this.getSeats();
      // * * *
      const socketId = this.seats.shift();
      this.sendActiveToClient(socketId);
      //console.log('Popped:', socketId);
      return this.playerTurnCountdown();
    } else if (this.seats.length > 0) {
      // * * *
      const socketId = this.seats.shift();
      this.sendActiveToClient(socketId);
      //console.log('Popped:', socketId);
      return this.playerTurnCountdown();
    } else {
      this.gameDBService.encryptionService
        .decryptStringAsync(this.gameID)
        .then((gameID) => {
          console.log(gameID);
          console.log(this.tableID);
          console.log('Process completed');
          this.killCountdown();
        });
    }
  }

  killCountdown(): void {
    this.countdownTimer = null;
  }
}
