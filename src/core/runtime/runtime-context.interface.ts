import { ProviderManager } from "../provider/provider.manager";

export interface RuntimeContext {

  db: any;

  state: Record<string, any>;

  transport: any;

  ai: ProviderManager;

  prompt(
    route: string,
    handler: Function,
  ): void;
}
// export interface RuntimeContext {

//   db: any;

//   state: Record<string, any>;

//   transport: any;

//   ai: ProviderManager;
// }