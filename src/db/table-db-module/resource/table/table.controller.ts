// import { setTimeout } from 'node:timers';
import { TableService } from './table.service';
import { Controller } from '@nestjs/common';
import { ITable } from './table.interface';

@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  async createTable(table: ITable) {
    return await this.tableService.create(table);
  }
  
  async getPaginatedTables(page: string, max: string) {
    const pageNumber = Number(page);
    const perPage = Number(max);
    return await this.tableService.getPaginatedWithTableCleanup(pageNumber, perPage);
    // return await this.tableService.getPaginatedWithSeats(pageNumber, perPage);
    // return await this.tableService.getPaginated(pageNumber, perPage);
  }

  /* update start time and get table */
  // async getTable(tableid: string, id: string, startTime: number) {
  //   return this.tableService
  //     .updateStartTime(tableid, startTime)
  //     .then(async () => { // return value not needed here
  //       return await this.tableService.getTableById(tableid);
  //     });
  // }

  /* update start time and get table */
  async getTable(tableid: string) {
    return await this.tableService.getTableById(tableid);
  }

  async joinTable(
    tableid: string,
    socketid: string,
    // startTime: string,
    player: boolean,
  ) {
    return await this.tableService.addSocketIdToPlayersArray(
      tableid,
      socketid,
      // startTime,
      player,
    );
  }

  async getPlayers(tableid: string) {
    return await this.tableService.getPlayersArray(tableid);
  }

  /* first leave watchers array */
  /* then players, return table doc */
  /* todo: design/seperate this... */
  async leaveTable(gameID: string, socketid: string, tableid: string) {
    await this.tableService.removeSocketIdFromWatchersArray(socketid, tableid);
    // await this.tableService.removeSeatMapValue(gameID, socketid);
    return await this.tableService.removeSocketIdFromPlayersArray(
      socketid,
      tableid,
    );
  }
}
