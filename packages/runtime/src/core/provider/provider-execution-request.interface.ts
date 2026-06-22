export interface ProviderExecutionRequest {
  prompt: string;
  apiKey?: string;
  data?: unknown;
  metadata?: Record<string, unknown>;
}

export interface AgentProvider {
  precheck?(apiKey?: string): Promise<void>;

  execute(request: ProviderExecutionRequest): Promise<string>;
}
