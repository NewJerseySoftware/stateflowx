import { Injectable } from '@nestjs/common';

import { ProviderManager } from '../../../core/provider/provider.manager';

@Injectable()
export class AgentService {
  constructor(private readonly providers: ProviderManager) {}

  async prompt(prompt: string): Promise<string> {
    return this.providers.get('gemini').generate(prompt);
  }
}
