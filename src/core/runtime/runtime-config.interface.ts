import { DB } from '../db.interface';

import { ProviderManager } from '../provider/provider.manager';

export interface RuntimeConfig {
  protocol: any;

  providers: ProviderManager;

  db?: DB;

  //transport: any;

}

