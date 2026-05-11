export interface AgentProvider {

  generate(
    prompt: string,
  ): Promise<string>;
}