// import { setTimeout } from 'node:timers';
import { UserService } from './user.service';
import { Controller } from '@nestjs/common';
import { IUser } from './user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*
  async createTable(table: IUser) {
    return await this.tableService.create(table);
  }
  async getPaginatedTables(page: string, max: string) {
    const pageNumber = Number(page);
    const perPage = Number(max);
    return await this.tableService.getPaginated(pageNumber, perPage);
  }
  async getTable(id: string) {
    return await this.tableService.getTableById(id);
  }
  async joinTable(tableid: string, socketid: string, startTime: string) {
    return await this.tableService.addSocketIdToPlayersArray(
      tableid,
      socketid,
      startTime,
    );
  }

  async getPlayers(tableid:string){
    return await this.tableService.getPlayersArray(tableid);
  }

  async leaveTable(socketid: string, tableid: string) {
    return await this.tableService.removeSocketIdFromPlayersArray(
      socketid,
      tableid,
    );
  }
  */

}
