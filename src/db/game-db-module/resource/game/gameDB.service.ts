import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { GameDocument } from './game.schema';
import { EncryptionService } from 'src/shared/services/encryption/encryption.service';
import { handleServerErrors } from 'src/db/util';

@Injectable()
export class GameDBService {
  errorArray: [];
  constructor(
    @Inject('GAME_MODEL') readonly gameModel: Model<GameDocument>,
    @Inject('TABLE_MODEL') readonly tableModel: Model<GameDocument>,
    public encryptionService: EncryptionService,
  ) {}

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /* also in tableService */
  async getSeatsByGameId(gameID: string): Promise<any> {
    return this.encryptionService
      .decryptStringAsync(gameID)
      .then(async (_id) => {
        try {
          const gameDoc = await this.gameModel.findById(_id).exec();
          if (!gameDoc.seats) {
            gameDoc.seats = new Map<string, string>();
          } else {
            const uniqueSeats = new Map<string, string>();
            const duplicateKeys: string[] = [];

            // Iterate over the existing seats Map
            gameDoc.seats.forEach((value, key) => {
              // Check if the key is already present in the uniqueSeats Map
              if (uniqueSeats.has(key)) {
                duplicateKeys.push(key); // Store duplicate key
              } else {
                uniqueSeats.set(key, value); // Add unique key-value pair to uniqueSeats Map
              }
            });

            // Remove duplicate keys from the seats Map
            duplicateKeys.forEach((key) => {
              gameDoc.seats.delete(key);
            });
          }

          return { success: true, data: { game: gameDoc } };
        } catch (error) {
          return handleServerErrors('Error getting seats: ', error);
        }
      });
  }

  // /* also in tableService */
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

  async removeSeatMapValue(gameID: string, socketid: string): Promise<any> {
    const _id = this.encryptionService.decryptString(gameID);
    try {
      const game = await this.gameModel.findById(_id);

      if (game && game.seats instanceof Map) {
        for (const [seat, value] of game.seats.entries()) {
          if (value === socketid) {
            game.seats.delete(seat);
            break;
          }
        }
      }

      // if (game.seats.size === 0) {
      //   await this.gameModel.findByIdAndUpdate(gameID, { active: false });
      // }

      // Save the updated game object
      const doc = await game.save();

      return { success: true, data: doc };
    } catch (error) {
      return handleServerErrors('Error removing seat: ', error);
    }
  }

  async getGameFromTableID(tableID: string) {
    return this.encryptionService
      .decryptStringAsync(tableID)
      .then(async (_id) => {
        try {
          const game = await this.tableModel
            .findById(_id)
            .populate('gameID')
            .exec();
          return { success: true, game: game };
        } catch (error) {
          return handleServerErrors(
            'error getting game from table model: ',
            error,
          );
        }
      });
  }

  // async getGameFromTableID(tableID: string) {
  //   const _id = this.encryptionService.decryptString(tableID);
  //   try {
  //     const game = await this.tableModel
  //       .findById(_id)
  //       .populate('gameID')
  //       .exec();
  //     return { success: true, game: game };
  //   } catch (error) {
  //     return handleServerErrors('error getting game from table model: ', error);
  //   }
  // }

  async getGameActiveStatus(gameID: string): Promise<any> {
    try {
      const game = await this.gameModel.findById(gameID);
      return { success: true, data: game };
    } catch (error) {
      return handleServerErrors('error getting game active status: ', error);
    }
  }

  async internalUpdateGameActive(
    gameID: string,
    status: boolean,
  ): Promise<any> {
    // const _id = this.encryptionService.decryptString(gameID);
    try {
      const game = await this.gameModel.findById(gameID);
      await this.gameModel.findByIdAndUpdate(gameID, { active: status });
      const doc = await game.save();
      return { success: true, data: doc };
    } catch (error) {
      return handleServerErrors('error removing seat: ', error);
    }
  }

  async updateSeatMap(
    gameID: string,
    seat: string,
    socketid: string,
  ): Promise<any> {
    return this.encryptionService
      .decryptStringAsync(gameID)
      .then(async (_id) => {
        try {
          const game = await this.gameModel.findById(_id);

          if (game && game.seats instanceof Map) {
            // seats property exists and is a Map, set the value for a specific seat
            game.seats.set(seat, socketid);
          } else {
            // seats property does not exist or is not a Map, create it as a Map and set the initial value
            game.seats = new Map([[seat, socketid]]);
          }

          // Save the updated game object
          const doc = await game.save();

          return { success: true, data: doc };
        } catch (error) {
          return handleServerErrors('error adding seat: ', error);
        }
      });
  }

  // async updateSeatMap(
  //   gameID: string,
  //   seat: string,
  //   socketid: string,
  // ): Promise<any> {
  //   const _id = this.encryptionService.decryptString(gameID);
  //   try {
  //     const game = await this.gameModel.findById(_id);

  //     if (game && game.seats instanceof Map) {
  //       // seats property exists and is a Map, set the value for a specific seat
  //       game.seats.set(seat, socketid);
  //     } else {
  //       // seats property does not exist or is not a Map, create it as a Map and set the initial value
  //       game.seats = new Map([[seat, socketid]]);
  //     }

  //     // Save the updated game object
  //     const doc = await game.save();

  //     return { success: true, data: doc };
  //   } catch (error) {
  //     return handleServerErrors('error adding seat: ', error);
  //   }
  // }
}
