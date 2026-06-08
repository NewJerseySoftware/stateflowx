export interface AgentProvider {

    precheck?(
    apiKey?: string
  ): Promise<void>;

  generate(
    prompt: string, 
    apiKey?: string
  ): Promise<string>;
}
