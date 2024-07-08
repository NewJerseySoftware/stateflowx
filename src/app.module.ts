import { Module } from '@nestjs/common';
import EventsGateway from './ws/gateway/events.gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JsonRpcService } from './ws/provider/json-rpc/json-rpc.service';
import { JSONRPCServerAndClient } from 'json-rpc-2.0';
import { UUIDService } from './shared/services/uuid/uuid.service';
import { ConnectionService } from './ws/provider/connection/connection.service';
import { CoreServices } from './ws/core/core';
import { HttpProvider } from './shared/services/http/http-provider';
import { HttpModule } from '@nestjs/axios';
import { AwsConfigService } from './shared/services/aws-config/aws.service';
import { ConfigService } from '@nestjs/config';
import { TableService } from './db/table-db-module/resource/table/table.service';
import { TableController } from './db/table-db-module/resource/table/table.controller';
import { TableJsonrpcService } from './db/table-db-module/json-rpc/table-rpc.service';
import { BjJsonrpcService } from './blackjack-game/json-rpc/bj-jsonrpc.service';
import { TableDBModule } from './db/table-db-module/tableDB.module';
import { AppConfigService } from './config/config.service';
import { EncryptionService } from './shared/services/encryption/encryption.service';
import { UserDBModule } from './db/user-db-module/userDB.module';
import { UserController } from './db/user-db-module/resource/user/user.controller';
import { UserService } from './db/user-db-module/resource/user/user.service';
import { GameDBModule } from './db/game-db-module/gameDB.module';
import { GameDBController } from './db/game-db-module/resource/game/gameDB.controller';
import { GameDBService } from './db/game-db-module/resource/game/gameDB.service';
import { MessageService } from './blackjack-game/message/message';
import { GameFlow } from './blackjack-game/game-flow/game-flow';
import { GameProvider } from './blackjack-game/game/game.provider';

// https://docs.nestjs.com/techniques/mongodb

@Module({
  imports: [
    HttpModule,
    GameDBModule,
    TableDBModule,
    UserDBModule,
  ],
  exports: [],
  controllers: [AppController],
  providers: [
    AppService,
    EventsGateway,
    JsonRpcService,
    JSONRPCServerAndClient,
    UUIDService,
    BjJsonrpcService,
    ConnectionService,
    CoreServices,
    HttpProvider,
    AwsConfigService,
    ConfigService,
    AppConfigService,
    TableController,
    TableService,
    UserController,
    UserService,
    GameDBController,
    GameDBService,
    TableJsonrpcService,
    EncryptionService,
    MessageService,
    GameProvider,
    GameFlow
  ],
})
export class AppModule {}
