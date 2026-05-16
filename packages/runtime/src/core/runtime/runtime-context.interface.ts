import { ProviderManager } from '../provider/provider.manager.js';

export interface RuntimeContext {
  db: any;

  state: Record<string, any>;

  //transport: any;
  protocol: any;

  ai: ProviderManager;

  prompt(route: string, handler: Function): void;
}
