import { RuntimeContext, RuntimeApp } from "../../runtime/index.js";

export class RelayOpsApp implements RuntimeApp {
  register(runtime: RuntimeContext) {
    runtime.prompt(
  'relay-ops.prompt',
  async ({ prompt }: { prompt: string }) => {
    return runtime.ai.generate(prompt);
  }
);
  }
}
