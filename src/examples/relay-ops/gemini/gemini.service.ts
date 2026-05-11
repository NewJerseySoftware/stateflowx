import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {

  private readonly genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!
  );

  private readonly model = this.genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  async prompt(prompt: string): Promise<string> {

    const result = await this.model.generateContent(prompt);

    return result.response.text();
  }
}