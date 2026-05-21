import { RuntimeContext, RuntimeApp } from '../../runtime/index.js';

export class PingPongApp implements RuntimeApp {
  register(runtime: RuntimeContext): void {
    runtime.state.counter = 0;

    runtime.prompt('ping', async () => {
      return {
        message: 'pong',
        counter: runtime.state.counter,
        time: Date.now(),
      };
    });

    runtime.prompt('increment', async () => {
      const currentCounter =
        typeof runtime.state.counter === 'number' ? runtime.state.counter : 0;

      runtime.state.counter = currentCounter + 1;

      return {
        counter: runtime.state.counter,
      };
    });
  }
}
