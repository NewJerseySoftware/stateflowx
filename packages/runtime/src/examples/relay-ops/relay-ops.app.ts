import { RuntimeContext, RuntimeApp } from '../../runtime/index.js';

export class RelayOpsApp implements RuntimeApp {
  register(runtime: RuntimeContext) {
    runtime.prompt('relay-ops.prompt', async (payload: unknown) => {
      if (
        typeof payload !== 'object' ||
        payload === null ||
        !('prompt' in payload) ||
        typeof payload.prompt !== 'string'
      ) {
        throw new Error('Invalid payload');
      }

      return runtime.providers.execute('gemini', { prompt: payload.prompt });
    });
  }
}
