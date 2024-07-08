import { Connection } from 'mongoose';
import { GameDB, GameSchema } from './game.schema';
import { ConfigService } from '@nestjs/config';

export const gameModelProvider = {
  provide: 'GAME_MODEL',
  useFactory: async (
    connection: Connection,
    configService: ConfigService,
  ): Promise<typeof GameDB> => {
    return connection.model<GameDB>('Game', GameSchema);
  },
  inject: ['DATABASE_CONNECTION', ConfigService],
};
