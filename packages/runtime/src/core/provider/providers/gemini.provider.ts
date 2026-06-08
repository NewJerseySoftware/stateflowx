import { GoogleGenerativeAI } from '@google/generative-ai';

import { AgentProvider } from '../provider.interface.js';

export class GeminiProvider implements AgentProvider {
  async generate(prompt: string, apiKey?: string): Promise<string> {
    console.log('Gemini prompt:', prompt);

    console.log('[GEMINI PROVIDER API KEY]', {
      hasApiKey: !!apiKey,
      length: apiKey?.length,
    });

    const genAI = new GoogleGenerativeAI(
      apiKey ?? process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    console.log('Gemini response:', text);

    return text;
  }

  async precheck(
    apiKey?: string
  ): Promise<void> {

    const genAI = new GoogleGenerativeAI(
      apiKey ?? process.env.GEMINI_API_KEY!
    );

    const model =
      genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

    await model.generateContent(
      'ping'
    );
  }
}
