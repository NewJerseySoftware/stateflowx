import { RuntimeContext, RuntimeApp } from "../../runtime/index.js";


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
