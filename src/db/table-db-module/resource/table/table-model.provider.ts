import { Connection, model, Model } from 'mongoose';
import { Table, TableSchema } from './table.schema';
import { ConfigService } from '@nestjs/config';
import { GameDB } from 'src/db/game-db-module/resource/game/game.schema';

export const tableModelProvider = {
  provide: 'TABLE_MODEL',
  useFactory: async (
    connection: Connection,
    configService: ConfigService,
  ): Promise<Model<Table>> => {
    const TableModel = connection.model<Table>('Table', TableSchema);
    const GameModel = model<GameDB>('Game'); // Retrieve the Game model needed here as well
    return TableModel;
  },
  inject: ['DATABASE_CONNECTION', ConfigService],
};


// import { Connection, createConnection } from 'mongoose';
// import { Table, TableSchema } from './table.schema';
// import { ConfigService } from '@nestjs/config';

// export const tableModelProvider = {
//   provide: 'TABLE_MODEL',
//   useFactory: async (
//     connection: Connection,
//     configService: ConfigService,
//   ): Promise<typeof Table> => {
//     return connection.model<Table>('Table', TableSchema);
//   },
//   inject: ['DATABASE_CONNECTION', ConfigService],
// };
