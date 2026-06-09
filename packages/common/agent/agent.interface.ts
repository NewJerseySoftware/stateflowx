export interface Agent {
  name: string;
  priority?: number;

  execute(payload?: unknown): Promise<unknown>;
}
