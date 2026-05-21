import { Module } from '@nestjs/common';

import EventsGateway from './core/transport/ws/events.gateway.js';

import { HttpTransport } from './core/transport/http/http.transport.js';

import { HttpRpcController } from './core/transport/http/http.controller.js';

@Module({
  providers: [EventsGateway, HttpTransport],

  controllers: [HttpRpcController],
})
export class AppModule {}
