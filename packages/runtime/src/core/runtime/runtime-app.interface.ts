import { RuntimeContext } from './runtime-context.interface.js';

export interface RuntimeApp {

  register(
    runtime: RuntimeContext
  ): void;
  
}
