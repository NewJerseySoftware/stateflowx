export interface AgentProvider {
  generate(prompt: string, apiKey?: string): Promise<string>;
}
