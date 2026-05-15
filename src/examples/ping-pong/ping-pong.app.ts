import { RuntimeApp } from 'src/core/runtime/runtime-app.interface';
import { RuntimeContext } from 'src/core/runtime/runtime-context.interface';

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
      runtime.state.counter++;

      return {
        counter: runtime.state.counter,
      };
    });
  }
}
