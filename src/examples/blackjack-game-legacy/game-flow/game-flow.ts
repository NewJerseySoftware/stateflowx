import { Injectable } from '@nestjs/common';
import { GameProvider } from '../game/game.provider';

@Injectable()
export class GameFlow extends GameProvider {
  activeTime: number;
  countdownTimer: NodeJS.Timer | null;
  server: any;
  clientsMap: any;
  tableID: string;
  startTime: string;
  gameID: string;
  seats: string[];
  playerTurnTime: number = 10;
  activeSocket: string;

  initGameFlow(
    server: any,
    clientsMap: any,
    gameID: string,
    tableID: string,
    startTime: string,
    activeTime: number,
  ) {
    this.tableID = tableID;
    this.startTime = startTime;
    this.server = server;
    this.gameID = gameID;
    this.clientsMap = clientsMap;
    this.activeTime = activeTime;
    this.addGame(
      this.gameID,
      this.tableID,
      this.startTime,
      this.server,
      this.clientsMap,
      this.activeTime,
    );
  }
}
