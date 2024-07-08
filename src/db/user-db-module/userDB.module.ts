import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EncryptionService } from 'src/shared/services/encryption/encryption.service';
import { AppConfigService } from 'src/config/config.service';
import { databaseConnectionProvider } from 'src/db/database.provider';
import { userModelProvider } from './resource/user/user-model.provider';
import { UserService } from './resource/user/user.service';

@Module({
  imports: [ConfigModule.forRoot()],
  exports: [userModelProvider],
  controllers: [],
  providers: [
    databaseConnectionProvider,
    userModelProvider,
    UserService,
    EncryptionService,
    AppConfigService,
  ],
})
export class UserDBModule {}
