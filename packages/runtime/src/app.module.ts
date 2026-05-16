import { Module } from '@nestjs/common';

import EventsGateway from './gateway/events.gateway.js';

@Module({
  providers: [EventsGateway],
})
export class AppModule {}