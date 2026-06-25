export interface RuntimeService {

  name: string;
  
  execute(input?: unknown): Promise<unknown>;
  
}
