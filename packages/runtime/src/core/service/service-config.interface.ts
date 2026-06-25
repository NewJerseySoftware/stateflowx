export interface ServiceConfig {
  
  name: string;

  execute(input?: unknown): Promise<unknown>;
}
