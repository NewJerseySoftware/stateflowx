import { DB } from '../db.interface.js';

import { ProviderManager } from '../provider/provider.manager.js';

export interface RuntimeConfig {
  protocol: any;

  providers: ProviderManager;

  db?: DB;

  //transport: any;

}

