import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { tableModelProvider } from './resource/table/table-model.provider';
import { TableService } from './resource/table/table.service';
import { EncryptionService } from 'src/shared/services/encryption/encryption.service';
import { AppConfigService } from 'src/config/config.service';
import { databaseConnectionProvider } from '../database.provider';
import { gameModelProvider } from '../game-db-module/resource/game/game-model.provider';

@Module({
  imports: [ConfigModule.forRoot()],
  exports: [tableModelProvider],
  controllers: [],
  providers: [
    databaseConnectionProvider,
    gameModelProvider,
    tableModelProvider,
    TableService,
    EncryptionService,
    AppConfigService
  ],
})
export class TableDBModule {}
