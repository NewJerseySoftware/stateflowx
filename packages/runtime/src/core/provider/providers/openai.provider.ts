import OpenAI from 'openai';

import {
  AgentProvider,
  ProviderExecutionRequest,
} from '../provider-execution-request.interface.js';

export class OpenAIProvider implements AgentProvider {

  async execute(
    request: ProviderExecutionRequest
  ): Promise<string> {

    console.log('OpenAI prompt:', request.prompt);

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: 'gpt-5',
      input: request.prompt,
    });

    const text = response.output_text;

    console.log('OpenAI response:', text);

    return text;
  }

  async precheck(): Promise<void> {

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    await client.responses.create({
      model: 'gpt-5',
      input: 'ping',
    });
  }
}