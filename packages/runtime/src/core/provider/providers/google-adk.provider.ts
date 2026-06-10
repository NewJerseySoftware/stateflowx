import { GoogleADKAgent } from "../../agent/google-adk-agent.js";
import { AgentProvider } from "../provider.interface.js";

export class GoogleAdkProvider implements AgentProvider {
  constructor(
    private readonly agent: GoogleADKAgent
  ) {}

  async generate(
    prompt: string,
    apiKey?: string
  ): Promise<string> {

    // TODO:
    // use configured MCP toolsets
    return this.agent.execute({
      prompt,
      apiKey,
    }) as Promise<string>;
  }

  async precheck(): Promise<void> {
    return;
  }
}




// import { AgentProvider }
//     from '../provider.interface.js';

// export class GoogleAdkProvider
//     implements AgentProvider {

//     async generate(
//         prompt: string,
//         _apiKey?: string
//     ): Promise<string> {

//         console.log(
//             '[GOOGLE ADK]',
//             prompt
//         );

//         throw new Error(
//             'Not implemented'
//         );
//     }

//     async precheck(
//         apiKey?: string
//     ): Promise<void> {
//         return;
//     }
// }