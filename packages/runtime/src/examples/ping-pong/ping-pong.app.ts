import {
  RuntimeContext,
  RuntimeApp,
} from '../../runtime/index.js';

export class PingPongApp implements RuntimeApp {
  register(runtime: RuntimeContext): void {
    runtime.prompt('ping', async () => {
      const counter =
        await runtime.store?.get<number>(
          'counter'
        ) ?? 0;

      return {
        message: 'pong',
        counter,
        time: Date.now(),
      };
    });

    runtime.prompt('increment', async () => {
      const currentCounter =
        await runtime.store?.get<number>(
          'counter'
        ) ?? 0;

      const nextCounter =
        currentCounter + 1;

      await runtime.store?.set(
        'counter',
        nextCounter
      );

      return {
        counter: nextCounter,
      };
    });
  }
}
