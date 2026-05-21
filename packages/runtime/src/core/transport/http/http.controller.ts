import { Body, Controller, Post } from '@nestjs/common';

import { HttpTransport } from './http.transport.js';

@Controller('rpc')
export class HttpRpcController {
  constructor(private readonly transport: HttpTransport) {}

  @Post()
  async handleRpc(@Body() body: unknown) {
    return this.transport.handleRequest(body);
  }
}
