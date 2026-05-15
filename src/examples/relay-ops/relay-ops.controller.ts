import { Body, Controller, Post } from '@nestjs/common';

import { AgentService } from './agent/agent.service';

@Controller('relay-ops')
export class RelayOpsController {
  constructor(private readonly agentService: AgentService) {}

  @Post('prompt')
  async prompt(@Body() body: { prompt: string }) {
    const response = await this.agentService.prompt(body.prompt);

    return {
      response,
    };
  }
}
