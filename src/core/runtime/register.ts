import { StateflowApp } from "../app.interface";
import { RuntimeConfig } from "./runtime-config";

export function register(app: StateflowApp, config: RuntimeConfig) {
  const ctx = {
    db: config.db,
    state: {},
    transport: config.transport,
  };

  app.init(ctx);

  config.adapters.forEach(adapter=> {
    adapter.register(app, ctx);
  });
}