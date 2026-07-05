import { RuntimeContext, RuntimeApp } from '../../runtime/index.js';

export class PingPongApp implements RuntimeApp {

  register(runtime: RuntimeContext): void {

    runtime.store?.set('counter', 0);

    runtime.prompt('ping', async () => {

      return {
        message: 'pong',

        counter: runtime.store?.get<number>('counter') ?? 0,

        time: Date.now(),
      };

    });

    runtime.prompt('increment', async () => {

      const currentCounter =
        runtime.store?.get<number>('counter') ?? 0;

      runtime.store?.set(
        'counter',
        currentCounter + 1
      );

      return {

        counter:
          runtime.store?.get<number>('counter') ?? 0,

      };

    });

  }

}
