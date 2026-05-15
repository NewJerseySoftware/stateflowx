import { GoogleGenerativeAI } from '@google/generative-ai';

import { AgentProvider } from '../provider.interface';

export class GeminiProvider implements AgentProvider {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  async generate(prompt: string): Promise<string> {
    console.log('Gemini prompt:', prompt);

    const model = this.genAI.getGenerativeModel({
      //model: 'gemini-pro'
      model: 'gemini-2.5-flash'
      //model: 'gemini-1.5-flash',
    });

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    console.log('Gemini response:', text);

    return text;
  }
}
