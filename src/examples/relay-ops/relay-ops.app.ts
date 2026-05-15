import { RuntimeApp } from 'src/core/runtime/runtime-app.interface';
import { RuntimeContext } from 'src/core/runtime/runtime-context.interface';

export class RelayOpsApp implements RuntimeApp {
  register(runtime: RuntimeContext) {
    runtime.prompt('relay-ops.prompt', async ({ prompt }) => {
      return runtime.ai.generate(prompt);
    });
  }
}
