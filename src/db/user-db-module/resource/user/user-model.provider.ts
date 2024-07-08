import { Connection, createConnection } from 'mongoose';
import { User, UserSchema } from './user.schema';
import { ConfigService } from '@nestjs/config';

export const userModelProvider = {
  provide: 'USER_MODEL',
  useFactory: async (
    connection: Connection,
    configService: ConfigService,
  ): Promise<typeof User> => {
    return connection.model<User>('User', UserSchema);
  },
  inject: ['DATABASE_CONNECTION', ConfigService],
};
// export const userModelProvider = {
//   provide: 'USER_MODEL',
//   useFactory: async (configService: ConfigService): Promise<typeof User> => {
//     const connectionString = configService.get<string>('MONGODB_URI');
//     const connection: Connection = createConnection(connectionString, {
//       dbName: configService.get<string>('MONGODB_NAME'),
//       // user: 'my_user',
//       // pass: 'my_password',
//       // ssl: true,
//       // readPreference: 'secondary',
//       // writeConcern: {
//       //   w: 'majority',
//       //   j: true,
//       // },
//     });
//     return connection.model<User>('User', UserSchema);
//   },
//   inject: [ConfigService],
// };
