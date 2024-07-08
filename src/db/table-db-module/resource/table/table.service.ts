import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TableDocument } from './table.schema';
import { ITable } from './table.interface';
import { handleServerErrors } from '../../../util';
import { EncryptionService } from 'src/shared/services/encryption/encryption.service';
import { GameDocument } from 'src/db/game-db-module/resource/game/game.schema';

/*
 * special errors
 * 007 ignore on UI
 */

type AddSocketIdToPlayersArrayResult = {
  success: boolean;
  data?: any; // Adjust the type of `data` to match the expected return data type
};

@Injectable()
export class TableService {
  errorArray: [];
  constructor(
    @Inject('TABLE_MODEL') readonly tableModel: Model<TableDocument>,
    @Inject('GAME_MODEL') readonly gameModel: Model<GameDocument>,
    private encryptionService: EncryptionService,
  ) {}

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /* also adds game */
  async create(table: ITable): Promise<any> {
    try {
      const newTable = new this.tableModel(table);
      const newGame = new this.gameModel();
      const savedGame = await newGame.save();
      newTable.gameID = savedGame._id;
      newTable.startTime = Date.now().toString();
      await this.delay(2000);
      const savedTable = await newTable.save();
      return { success: true, data: { table: savedTable, game: savedGame } };
    } catch (error) {
      return handleServerErrors('Error creating table: ', error);
    }
  }

  async deleteEmptyTables(): Promise<void> {
    try {
      const emptyTables = await this.tableModel.find({ players: { $size: 0 } }).exec();
      
      for (const table of emptyTables) {
        await this.gameModel.deleteOne({ _id: table.gameID }).exec();
      }

      await this.tableModel.deleteMany({ players: { $size: 0 } }).exec();
      console.log('Empty tables and associated game documents deleted successfully.');
    } catch (error) {
      console.error('Error deleting empty tables:', error);
      throw error;
    }
  }
  
  
  async deleteEmptyTables2(): Promise<void> {
    try {
      await this.tableModel.deleteMany({ players: { $size: 0 } }).exec();
      console.log('Empty tables deleted successfully.');
    } catch (error) {
      console.error('Error deleting empty tables:', error);
      throw error;
    }
  }

  // async deleteEmptyTablesAndGames(): Promise<void> {
  //   try {
  //     const emptyTables = await this.tableModel.find({ players: { $size: 0 } }).exec();
      
  //     // Retrieve the gameIDs of empty tables
  //     const gameIDs = emptyTables.map(table => table.gameID._id.toString());
  //     console.log(gameIDs);
  //     console.log(gameIDs);
  //     // Delete the empty tables
  //     await this.tableModel.deleteMany({ players: { $size: 0 } }).exec();
      
  //     // Delete the associated game documents
  //     await this.gameModel.deleteMany({ _id: { $in: gameIDs } }).exec();
      
  //     console.log('Empty tables and associated game documents deleted successfully.');
  //   } catch (error) {
  //     console.error('Error deleting empty tables and associated game documents:', error);
  //     throw error;
  //   }
  // }
  
  
  async getPaginatedWithTableCleanup(pageNumber: number, perPage: number): Promise<any> {
    try {
      await this.deleteEmptyTables();
      return await this.getPaginated(pageNumber, perPage);
    } catch (error) {
      return handleServerErrors('Error getting paginated data: ', error);
    }
  }
  

  /* get tables if they have at least 1 player */
  async getPaginated(pageNumber: number, perPage: number): Promise<any> {
    try {
      const skipCount = pageNumber * perPage;
      const [paginated, totalCount] = await Promise.all([
        this.tableModel
          .find({ players: { $ne: [], $exists: true } })
          .skip(skipCount)
          .limit(perPage)
          .exec(),
        this.tableModel.countDocuments().exec(),
      ]);
      return { success: true, data: { paginated, totalCount } };
    } catch (error) {
      return handleServerErrors('Error getting tables: ', error);
    }
  }

  // async getPaginated(pageNumber: number, perPage: number): Promise<any> {
  //   try {
  //     const skipCount = pageNumber * perPage;
  //     const [paginated, totalCount] = await Promise.all([
  //       this.tableModel
  //         .find({ 'players.0': { $exists: true, $ne: [] } })
  //         .skip(skipCount)
  //         .limit(perPage)
  //         .exec(),
  //       this.tableModel.countDocuments().exec(),
  //     ]);
  //     return { success: true, data: { paginated, totalCount } };
  //   } catch (error) {
  //     console.log(error);
  //     return handleServerErrors('Error getting tables: ', error);
  //   }
  // }

  async getPaginated3(pageNumber: number, perPage: number): Promise<any> {
    try {
      const skipCount = pageNumber * perPage;
      const [paginated, totalCount] = await Promise.all([
        this.tableModel.find().skip(skipCount).limit(perPage).exec(),
        this.tableModel.countDocuments().exec(),
      ]);
      // no consistency
      // const [deletedCount, paginated, totalCount] = await Promise.all([
      //   this.tableModel.deleteMany({ 'players.0': { $exists: false } }).exec(),
      //   this.tableModel.find().skip(skipCount).limit(perPage).exec(),
      //   this.tableModel.countDocuments().exec(),
      // ]);
      //throw new NotFoundException(`User with ID TESTING not found.`);
      return { success: true, data: { paginated, totalCount } };
    } catch (error) {
      return handleServerErrors('Error getting tables: ', error);
    }
  }

  async getTableById(id: string): Promise<any> {
    return this.encryptionService.decryptStringAsync(id).then(async (_id) => {
      try {
        const doc = await this.tableModel
          .findById(_id)
          .populate({
            path: 'gameID',
            model: 'Game',
          })
          .exec();
        //const gameID = doc.gameID._id;
        //doc.gameID = gameID;
        return { success: true, data: doc };
      } catch (error) {
        return handleServerErrors('Error getting table: ', error);
      }
    });
  }

  // async getTableById(id: string): Promise<any> {
  //   const _id = this.encryptionService.decryptString(id);
  //   try {
  //     const doc = await this.tableModel
  //       .findById(_id)
  //       .populate({
  //         path: 'gameID',
  //         model: 'Game',
  //       })
  //       .exec();
  //     //const gameID = doc.gameID._id;
  //     //doc.gameID = gameID;
  //     return { success: true, data: doc };
  //   } catch (error) {
  //     return handleServerErrors('Error getting table: ', error);
  //   }
  // }

  // async getTableById(id: string): Promise<any> {
  //   const _id = this.encryptionService.decryptString(id);
  //   try {
  //     //throw new NotFoundException(`getTableById error test.`);
  //     return await this.tableModel.findById(_id).exec();
  //   } catch (error) {
  //     return handleServerErrors('Error getting table: ', error);
  //   }
  // }

  async getPlayersArray(id: string): Promise<any> {
    return this.encryptionService.decryptStringAsync(id).then(async (_id) => {
      try {
        //throw new NotFoundException(`getPlayersArray error test.`);
        const obj = await this.tableModel.findById(_id, 'players').exec();
        return { success: true, data: { players: obj.players } };
      } catch (error) {
        return handleServerErrors('Error getting Players: ', error);
      }
    });
  }

  // async getPlayersArray(id: string): Promise<any> {
  //   const _id = this.encryptionService.decryptString(id);
  //   try {
  //     //throw new NotFoundException(`getPlayersArray error test.`);
  //     const obj = await this.tableModel.findById(_id, 'players').exec();
  //     return { success: true, data: { players: obj.players } };
  //   } catch (error) {
  //     return handleServerErrors('Error getting Players: ', error);
  //   }
  // }

  async addSocketIdToPlayersArray(
    tableid: string,
    socketid: string,
    // startTime: string,
    player: boolean,
  ) {
    return this.encryptionService
      .decryptStringAsync(tableid)
      .then(async (_id) => {
        let ACTIVE = undefined;

        try {
          const document = await this.tableModel
            .findById(_id)
            .select('players watchers maxClients name uri gameID startTime')
            .populate('gameID')
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

          async function addWatcher() {
            document.watchers.push(socketid);
            const watcherDoc = await document.save();
            const result = {
              success: true,
              data: { type: 'watcher', doc: watcherDoc },
            };
            // throw new NotFoundException(`getTableById error test.`);
            return result;
          }
          if (!player) return addWatcher();

          if (player) {
            if (document.players.length < document.maxClients) {
              document.players.push(socketid);
              const playerDoc = await document.save();

              return {
                success: true,
                data: {
                  type: 'player',
                  doc: playerDoc,
                  active: ACTIVE,
                },
              };
            } else {
              return addWatcher();
            }
          }
        } catch (error) {
          return handleServerErrors('Error joining table: ', error);
        }
      });
  }

  // async addSocketIdToPlayersArray(
  //   tableid: string,
  //   socketid: string,
  //   // startTime: string,
  //   player: boolean,
  // ) {
  //   const _id = this.encryptionService.decryptString(tableid);
  //   let ACTIVE = undefined;

  //   try {
  //     const document = await this.tableModel
  //       .findById(_id)
  //       .select('players watchers maxClients name uri gameID startTime')
  //       .populate('gameID')
  //       .exec();

  //     if (!document) {
  //       throw new Error('Table not found');
  //     }

  //     if (document.players.includes(socketid)) {
  //       // if this is the case at this point, something is wrong
  //       // this shouldn't happen
  //       return handleServerErrors(
  //         'Error joining table: ',
  //         "You've already joined",
  //         '007',
  //       );
  //     }

  //     async function addWatcher() {
  //       document.watchers.push(socketid);
  //       const watcherDoc = await document.save();
  //       const result = {
  //         success: true,
  //         data: { type: 'watcher', doc: watcherDoc },
  //       };
  //       // throw new NotFoundException(`getTableById error test.`);
  //       return result;
  //     }
  //     if (!player) return addWatcher();

  //     if (player) {
  //       if (document.players.length < document.maxClients) {
  //         document.players.push(socketid);
  //         const playerDoc = await document.save();

  //         return {
  //           success: true,
  //           data: {
  //             type: 'player',
  //             doc: playerDoc,
  //             active: ACTIVE,
  //           },
  //         };
  //         // if (document.gameID) {
  //         //   const g = await this.gameModel.findByIdAndUpdate(document.gameID, {
  //         //     active: true,
  //         //   });
  //         //   ACTIVE = true;

  //         //   return {
  //         //     success: true,
  //         //     data: {
  //         //       type: 'player',
  //         //       doc: playerDoc,
  //         //       active: ACTIVE,
  //         //     },
  //         //   };
  //         // }
  //       } else {
  //         return addWatcher();
  //       }
  //     }
  //   } catch (error) {
  //     return handleServerErrors('Error joining table: ', error);
  //   }
  // }

  async updateStartTime(tableid: string, startTime: number) {
    return this.encryptionService
      .decryptStringAsync(tableid)
      .then(async (_id) => {
        let doc = null;
        let startTimeResult = '';
        try {
          const document = await this.tableModel
            .findById(_id)
            .select('startTime')
            .exec();

          if (!document) {
            throw new Error('table not found updated starttime failed');
          }
          if (
            typeof document.startTime === 'undefined' ||
            typeof document.startTime === null
          ) {
            document.startTime = startTime.toString();
            doc = await document.save();
            startTimeResult = doc.startTime;
          } else {
            startTimeResult = document.startTime;
          }
          return {
            success: true,
            data: { startTime: startTimeResult },
          };
        } catch (error) {
          return handleServerErrors('Error joining table: ', error);
        }
      });
  }

  // async updateStartTime(tableid: string, startTime: number) {
  //   const _id = this.encryptionService.decryptString(tableid);
  //   let doc = null;
  //   let startTimeResult = '';
  //   try {
  //     const document = await this.tableModel
  //       .findById(_id)
  //       .select('startTime')
  //       .exec();

  //     if (!document) {
  //       throw new Error('table not found updated starttime failed');
  //     }
  //     if (
  //       typeof document.startTime === 'undefined' ||
  //       typeof document.startTime === null
  //     ) {
  //       document.startTime = startTime.toString();
  //       doc = await document.save();
  //       startTimeResult = doc.startTime;
  //     } else {
  //       startTimeResult = document.startTime;
  //     }
  //     return {
  //       success: true,
  //       data: { startTime: startTimeResult },
  //     };
  //   } catch (error) {
  //     return handleServerErrors('Error joining table: ', error);
  //   }
  // }

  async removeSocketIdFromPlayersArray(socketid: string, tableid: string) {
    return this.encryptionService
      .decryptStringAsync(tableid)
      .then(async (_id) => {
        try {
          const document = await this.tableModel
            .findById(_id)
            .select('players gameID')
            .exec();

          if (!document) {
            throw new Error('Table not found');
          }

          const playerIndex = document.players.indexOf(socketid);
          if (playerIndex === -1) {
            throw new Error('Socket ID not found in the players array');
          }

          document.players.splice(playerIndex, 1);
          const doc = await document.save();

          // if (doc.players.length === 0 && doc.gameID) {
          //   await this.gameModel.findByIdAndUpdate(doc.gameID, { active: false });
          // }

          return { success: true, data: doc };
        } catch (error) {
          return handleServerErrors(
            'Error removing socket ID from players array: ',
            error,
          );
        }
      });
  }

  // async removeSocketIdFromPlayersArray(socketid: string, tableid: string) {
  //   const _id = this.encryptionService.decryptString(tableid);
  //   try {
  //     const document = await this.tableModel
  //       .findById(_id)
  //       .select('players gameID')
  //       .exec();

  //     if (!document) {
  //       throw new Error('Table not found');
  //     }

  //     const playerIndex = document.players.indexOf(socketid);
  //     if (playerIndex === -1) {
  //       throw new Error('Socket ID not found in the players array');
  //     }

  //     document.players.splice(playerIndex, 1);
  //     const doc = await document.save();

  //     // if (doc.players.length === 0 && doc.gameID) {
  //     //   await this.gameModel.findByIdAndUpdate(doc.gameID, { active: false });
  //     // }

  //     return { success: true, data: doc };
  //   } catch (error) {
  //     return handleServerErrors(
  //       'Error removing socket ID from players array: ',
  //       error,
  //     );
  //   }
  // }

  async removeSocketIdFromWatchersArray(socketid: string, tableid: string) {
    this.encryptionService.decryptStringAsync(tableid).then(async (_id) => {
      try {
        const document = await this.tableModel
          .findById(_id)
          .select('watchers')
          .exec();

        if (!document) {
          throw new Error('table not found removing watchers');
        }

        const watcherIndex = document.watchers.indexOf(socketid);
        if (watcherIndex === -1) {
          throw new Error('Socket id not found in the watchers array');
        }

        document.watchers.splice(watcherIndex, 1);
        const doc = await document.save();
        return { success: true, data: doc };
      } catch (error) {
        return handleServerErrors(
          'error removing socket id from watchers array: ',
          error,
        );
      }
    });
  }

  // async removeSocketIdFromWatchersArray(socketid: string, tableid: string) {
  //   const _id = this.encryptionService.decryptString(tableid);
  //   try {
  //     const document = await this.tableModel
  //       .findById(_id)
  //       .select('watchers')
  //       .exec();

  //     if (!document) {
  //       throw new Error('table not found removing watchers');
  //     }

  //     const watcherIndex = document.watchers.indexOf(socketid);
  //     if (watcherIndex === -1) {
  //       throw new Error('Socket id not found in the watchers array');
  //     }

  //     document.watchers.splice(watcherIndex, 1);
  //     const doc = await document.save();
  //     return { success: true, data: doc };
  //   } catch (error) {
  //     return handleServerErrors(
  //       'error removing socket id from watchers array: ',
  //       error,
  //     );
  //   }
  // }

  // async getSeatsByGameId(gameID: string): Promise<any> {
  //   const _id = this.encryptionService.decryptString(gameID);
  //   try {
  //     const gameDoc = await this.gameModel.findById(_id).exec();
  //     if (!gameDoc.seats) {
  //       gameDoc.seats = new Map<string, string>();
  //     } else {
  //       const uniqueSeats = new Map<string, string>();
  //       const duplicateKeys: string[] = [];

  //       // Iterate over the existing seats Map
  //       gameDoc.seats.forEach((value, key) => {
  //         // Check if the key is already present in the uniqueSeats Map
  //         if (uniqueSeats.has(key)) {
  //           duplicateKeys.push(key); // Store duplicate key
  //         } else {
  //           uniqueSeats.set(key, value); // Add unique key-value pair to uniqueSeats Map
  //         }
  //       });

  //       // Remove duplicate keys from the seats Map
  //       duplicateKeys.forEach((key) => {
  //         gameDoc.seats.delete(key);
  //       });
  //     }

  //     return { success: true, data: { game: gameDoc } };
  //   } catch (error) {
  //     return handleServerErrors('Error getting seats: ', error);
  //   }
  // }
}
