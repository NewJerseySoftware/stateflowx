import { register } from "./register";

export function bootstrapRuntime(server: any, apps: any[], config: any) {
  apps.forEach(app => register(app, {
    ...config,
    transport: { jsonrpc: server }
  }));
}