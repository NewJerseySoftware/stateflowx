import { GoogleGenerativeAI } from '@google/generative-ai';

import { AgentProvider } from '../provider.interface.js';
import { ProviderExecutionRequest } from '../provider-execution-request.interface.js';

export class GeminiProvider implements AgentProvider {
  async execute(request: ProviderExecutionRequest): Promise<string> {
    console.log('Gemini prompt:', request.prompt);

    const genAI = new GoogleGenerativeAI(
      request.apiKey ?? process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const result = await model.generateContent(request.prompt);

    const text = result.response.text();

    console.log('Gemini response:', text);
    return text;
  }

  async precheck(apiKey?: string): Promise<void> {
    const genAI = new GoogleGenerativeAI(apiKey ?? process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    await model.generateContent('ping');
  }
}
