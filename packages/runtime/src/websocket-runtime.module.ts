import { Module } from '@nestjs/common';

import EventsGateway
    from './core/transport/ws/events.gateway.js';

// import { WebSocketTransport }
//     from './core/transport/ws/ws.transport.js';

@Module({
    providers: [
        EventsGateway
    ],
})
export class WebSocketRuntimeModule { }