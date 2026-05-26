import 'dotenv/config';

import { NestFactory }
  from '@nestjs/core';

import { WsAdapter }
  from '@nestjs/platform-ws';

import { WebSocketServer }
  from 'ws';

import { WebSocketRuntimeModule }
  from './websocket-runtime.module.js';

import {
  bootstrapRuntime,
  createRuntime,
  GeminiProvider,
  RuntimeInitializeApp,
} from './index.js';

import { JsonRpcProtocol }
  from './core/protocol/json-rpc/json-rpc.protocol.js';

import { WebSocketTransport }
  from './core/transport/ws/ws.transport.js';
import { WebSocketEventDispatcher } from './core/events/dispatchers/ws/websocket-event-dispatcher.js';

async function bootstrap() {

  // const app =
  //   await NestFactory.create(
  //     HttpRuntimeModule,
  //     {
  //       cors: true,
  //     },
  //   );

  const app =
    await NestFactory.create(
      WebSocketRuntimeModule,
      {
        cors: true,
      },
    );

  app.useWebSocketAdapter(
    new WsAdapter(app),
  );

  app.enableCors({
    origin: 'http://localhost:4200',
  });

  await app.listen(3000);

  //
  // Runtime transport server
  //
  const server =
    new WebSocketServer({
      port: 3001,
    });

  const transport =
    new WebSocketTransport(server);

  // const transport =
  //   app.get(HttpTransport);

  const protocol =
    new JsonRpcProtocol();

  const runtime = createRuntime({
    transport,
    protocol,

    providers: [
      {
        name: 'gemini',

        provider:
          new GeminiProvider(),
      },
    ],

    services: [],

    execution: {
      enabled: true,

      events: {
        enabled: true,
      },

      artifacts: {
        enabled: false,
      },
    },
  });



  const dispatcher =
    new WebSocketEventDispatcher(server);

  runtime.events?.on(
    'runtime.message.received',

    async (event) => {

      await dispatcher.dispatch(event);

    },
  );



  bootstrapRuntime(
    [
      new RuntimeInitializeApp(),
    ],

    runtime,
  );

  console.log(
    'StateFlowX runtime listening on ws://localhost:3001',
  );

}

bootstrap();
