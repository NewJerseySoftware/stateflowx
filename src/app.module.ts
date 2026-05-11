import { Module } from '@nestjs/common';
import EventsGateway from './adapters/ws/gateway/events.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [EventsGateway],
})
export class AppModule {}