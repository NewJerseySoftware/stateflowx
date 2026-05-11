import { RuntimeContext } from './runtime-context.interface';

export interface RuntimeApp {

  register(
    runtime: RuntimeContext,
  ): void;
}