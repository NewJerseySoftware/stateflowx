import 'dotenv/config';

import { NestFactory } from '@nestjs/core';

import { WsAdapter } from '@nestjs/platform-ws';

import { WebSocketServer } from 'ws';

import {
  bootstrapRuntime,
  createRuntime,
  GeminiProvider,
  RuntimeInitializeApp,
  HttpTransport,
  MockProvider
} from './index.js';

import { JsonRpcProtocol } from './core/protocol/json-rpc/json-rpc.protocol.js';

import { WebSocketTransport } from './core/transport/ws/ws.transport.js';

import { WebSocketEventDispatcher } from './core/events/dispatchers/ws/websocket-event-dispatcher.js';

import { GoogleADKAgent } from './core/agent/google-adk-agent.js';

import { GoogleAdkProvider } from './core/provider/providers/google-adk.provider.js';

import { RuntimeModule } from './core/transport/Runtime.module.js';

import { OpenAIProvider } from './core/provider/providers/openai.provider.js';

async function bootstrap() {

  const app = await NestFactory.create(RuntimeModule, {
    cors: true,
  });

  app.useWebSocketAdapter(new WsAdapter(app));

  app.enableCors({
    origin: 'http://localhost:4200',
  });

  await app.listen(3000);

  //
  // Websocket transport server
  //
  const server = new WebSocketServer({
    port: 3001,
  });

  const transports = [
    app.get(HttpTransport),
    new WebSocketTransport(server),
  ]

  const protocol = new JsonRpcProtocol();

  const runtime = createRuntime({

    transports,

    protocol,

    agents: [
      {
        name: 'weather-agent',
        agent: new GoogleADKAgent('weather-agent'),
      },
    ],

    providers: [
      {
        name: 'gemini',
        provider: new GeminiProvider(),
      },
      {
        name: 'openai',
        provider: new OpenAIProvider(),
      },
      {
        name: 'mock',
        provider: new MockProvider(),
      },
      {
        name: 'google-adk',
        provider: new GoogleAdkProvider(
          new GoogleADKAgent('weather-agent')
        ),
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



  //
  // Runtime lifecycle
  //
  // 1. Register event dispatchers
  // 2. Bootstrap application components
  // 3. Initialize runtime
  // 4. Start runtime
  //
  runtime.addEventDispatcher(
    new WebSocketEventDispatcher(server)
  );

  bootstrapRuntime(
    [new RuntimeInitializeApp()],

    runtime
  );

  await runtime.initialize();

  await runtime.start();

  console.log('StateFlowX runtime listening on ws://localhost:3001');
}

bootstrap();
