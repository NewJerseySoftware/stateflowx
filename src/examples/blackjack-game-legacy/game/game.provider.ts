import { Injectable } from '@nestjs/common';
import { Blackjack } from './Game';

@Injectable()
export class GameProvider extends Blackjack {
  private games: Map<string, Blackjack> = new Map();
  protected id:string;
  protected tableID:string;
  protected startTime:string;
  protected server:any;
  protected clientsMap:any;

  addGame(
    id: string,
    tableID: string,
    startTime: string,
    server: any,
    clientsMap: any,
    activeTime: any
  ) {
    const game = new Blackjack(this.tableService, this.gameDBService);
    this.games.set(id, game);
    this.startGame(id, tableID, startTime, server, clientsMap, activeTime);
  }

  startGame(
    id: any,
    tableID: any,
    startTime: any,
    server: any,
    clientsMap: any,
    activeTime: any
  ) {
    const blackjack = this.games.get(id);
    blackjack.initGame(id, tableID, startTime, server, clientsMap, activeTime);
  }

  getGameByID(id: string): Blackjack | null {
    const game = this.games.get(id);
    return game || null;
  }

  getGameCount(): number {
    return this.games.size;
  }

  getAllGames(): Map<string, Blackjack> {
    return this.games;
  }
}
