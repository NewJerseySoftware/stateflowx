import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { IUser } from './user.interface';
import { handleServerErrors } from 'src/db/util';

@Injectable()
export class UserService {
  errorArray: [];
  constructor(
    @Inject('USER_MODEL') readonly userModel: Model<UserDocument>
  ) {}
  
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


  /*

  async getPaginated(pageNumber: number, perPage: number): Promise<any> {
    try {
      const skipCount = pageNumber * perPage;
      const [paginated, totalCount] = await Promise.all([
        this.tableModel.find().skip(skipCount).limit(perPage).exec(),
        this.tableModel.countDocuments().exec(),
      ]);
      //throw new NotFoundException(`User with ID TESTING not found.`);
      await this.delay(1000);
      return { success: true, data: { paginated, totalCount } };
    } catch (error) {
      return handleServerErrors('Error getting tables: ', error);
    }
  }

  async getTableById(id: string): Promise<any> {
    console.log('getTableById() ' + id);
    const _id = this.encryptionService.decryptString(id);
    try {
      //throw new NotFoundException(`getTableById error test.`);
      return await this.tableModel.findById(_id).exec();
    } catch (error) {
      return handleServerErrors('Error getting table: ', error);
    }
  }
  async getPlayersArray(id: string): Promise<any> {
    const _id = this.encryptionService.decryptString(id);
    try {
      //throw new NotFoundException(`getPlayersArray error test.`);
      const obj = await this.tableModel.findById(_id, 'players').exec();
      return { success: true, data: { players: obj.players } };
    } catch (error) {
      return handleServerErrors('Error getting Players: ', error);
    }
  }

  async addSocketIdToPlayersArray(
    tableid: string,
    socketid: string,
    startTime: string,
  ) {
    const _id = this.encryptionService.decryptString(tableid);
    try {
      const document = await this.tableModel
        .findById(_id)
        .select('players maxClients name uri gameID') // Select only the 'players' and 'maxClients' fields
        .exec();

      if (!document) {
        throw new Error('Table not found');
      }

      if (document.players.includes(socketid)) {
        // if this is the case at this point, something is wrong
        // this shouldn't happen
        return handleServerErrors(
          'Error joining table: ',
          "You've already joined",
          '007',
        );
      }

      if (document.players.length < document.maxClients) {
        document.players.push(socketid);
        if (typeof document.startTime === 'undefined') {
          document.startTime = startTime;
        }
        const doc = await document.save();
        return { success: true, data: doc };
      } else {
        throw new Error('Players array size exceeds maximum');
      }
    } catch (error) {
      return handleServerErrors('Error joining table: ', error);
    }
  }

  async removeSocketIdFromPlayersArray(socketid: string, tableid: string) {
    const _id = this.encryptionService.decryptString(tableid);
    try {
      const document = await this.tableModel
        .findById(_id)
        .select('players')
        .exec();

      if (!document) {
        throw new Error('Table not found');
      }

      const playerIndex = document.players.indexOf(socketid);
      if (playerIndex === -1) {
        throw new Error('Socket ID not found in the players array');
        // Socket ID not found in the players array
        //return { success: true };
      }

      document.players.splice(playerIndex, 1);
      const doc = await document.save();
      return { success: true, data: doc };
    } catch (error) {
      return handleServerErrors(
        'Error removing socket ID from players array: ',
        error,
      );
    }
  }
  */
}
