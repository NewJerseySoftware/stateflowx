import { Inject, Injectable } from '@nestjs/common';
import { UUIDService } from 'src/shared/services/uuid/uuid.service';
import { HttpProvider } from 'src/shared/services/http/http-provider';
import { TableController } from 'src/db/table-db-module/resource/table/table.controller';
import { EncryptionService } from 'src/shared/services/encryption/encryption.service';
import { UserController } from 'src/db/user-db-module/resource/user/user.controller';
import { GameDBController } from 'src/db/game-db-module/resource/game/gameDB.controller';
import { ConnectionService } from 'src/adapters/ws/provider/connection/connection.service';

@Injectable()
export class AppContext {
  constructor(
    @Inject(UUIDService) readonly uuidService: UUIDService,
    @Inject(ConnectionService) readonly connectionService: ConnectionService,
    @Inject(HttpProvider) readonly httpProvider: HttpProvider,
    @Inject(TableController) readonly tableController: TableController,
    @Inject(UserController) readonly userController: UserController,
    @Inject(GameDBController) readonly gameDBController: GameDBController,
    @Inject(EncryptionService) readonly encryptionService: EncryptionService,
  ) {}
}