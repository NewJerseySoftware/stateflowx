import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EncryptionService } from 'src/shared/services/encryption/encryption.service';
import { AppConfigService } from 'src/config/config.service';
import { databaseConnectionProvider } from 'src/db/database.provider';
import { gameModelProvider } from './resource/game/game-model.provider';
import { GameDBService } from './resource/game/gameDB.service';
import { tableModelProvider } from '../table-db-module/resource/table/table-model.provider';

@Module({
  imports: [ConfigModule.forRoot()],
  exports: [gameModelProvider, tableModelProvider],
  controllers: [],
  providers: [
    databaseConnectionProvider,
    gameModelProvider,
    tableModelProvider,
    GameDBService,
    EncryptionService,
    AppConfigService,
  ],
})
export class GameDBModule {}
