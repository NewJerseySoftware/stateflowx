import { Module } from "@nestjs/common";
import { HttpRpcController } from "./http/http.controller.js";
import { HttpTransport } from "./http/http.transport.js";
import EventsGateway from "./ws/events.gateway.js";

@Module({
  controllers: [
    HttpRpcController,
  ],

  providers: [
    HttpTransport,
    EventsGateway,
  ],

  exports: [
    HttpTransport,
  ],
})
export class RuntimeModule {}