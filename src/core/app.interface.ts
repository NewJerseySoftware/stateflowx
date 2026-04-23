import { AppContext } from './app-context.interface';

export interface StateflowApp {
  name: string;

  init(ctx: AppContext): void;

  actions: Record<string, (ctx: AppContext, payload?: any) => any>;
}