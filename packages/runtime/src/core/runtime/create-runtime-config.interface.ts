import { DB } from '../db.interface.js';

import { RuntimeApp } from './runtime-app.interface.js';

import { ProviderConfig } from '../provider/provider.config.interface.js';

import { ServiceConfig } from '../service/service-config.interface.js';

export interface CreateRuntimeConfig {
  apps: RuntimeApp[];

  providers: ProviderConfig[];

  services?: ServiceConfig[];

  db?: DB;
}