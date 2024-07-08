import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    MongooseModule,
    {
      provide: Connection,
      useFactory: (mongoose) => mongoose.connection,
      inject: [MongooseModule],
    },
    {
      provide: 'DATABASE_CONNECTION',
      useExisting: Connection,
    },
  ],
  exports: ['DATABASE_CONNECTION', Connection],
})
export class DatabaseModule {}
