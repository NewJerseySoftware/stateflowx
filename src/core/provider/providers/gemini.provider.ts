import { GoogleGenerativeAI }
from '@google/generative-ai';

import { AgentProvider }
from '../provider.interface';

export class GeminiProvider
implements AgentProvider {

  private readonly genAI =
    new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!,
    );

  private readonly model =
    this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

  async generate(
    prompt: string,
  ): Promise<string> {

    const result =
      await this.model.generateContent(
        prompt,
      );

    return result.response.text();
  }
}