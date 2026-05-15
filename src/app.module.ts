import { Module } from '@nestjs/common';
import EventsGateway from './core/transport/ws/events.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [EventsGateway],
})
export class AppModule {}
