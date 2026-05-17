import { Module } from '@nestjs/common';
import EventsGateway from './core/transport/ws/events.gateway.js';


@Module({
  providers: [EventsGateway],
})
export class AppModule {}