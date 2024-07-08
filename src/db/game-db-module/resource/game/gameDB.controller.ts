// import { setTimeout } from 'node:timers';
import { Controller } from '@nestjs/common';
import { GameDBService } from './gameDB.service';

@Controller('game')
export class GameDBController {
  constructor(private readonly gameDBService: GameDBService) {}

  async getSeats(gameID: string) {
    return await this.gameDBService.getSeatsByGameId(gameID);
  }

  async getSeatsByGameId(gameID: string) {
    return await this.gameDBService.getSeatsByGameId(gameID);
  }
  async removeSeatMapValue(gameID: string, socketid: string) {
    return await this.gameDBService.removeSeatMapValue(gameID, socketid);
  }
  async getGameActiveStatus(gameID: string){
    return await this.gameDBService.getGameActiveStatus(gameID);
  }
  async getGameFromTableID(tableID:string){
    return await this.gameDBService.getGameFromTableID(tableID);
  }

  async addSeat(gameID: string, seat: string, socketid: string) {
    console.log('SEAT: ', seat);
    return await this.gameDBService.updateSeatMap(gameID, seat, socketid);
  }
}
