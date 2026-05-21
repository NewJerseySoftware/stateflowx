import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module.js';

import {
  createRuntime,
  bootstrapRuntime,
  RuntimeInitializeApp,
  GeminiProvider,
} from './index.js';

import { JsonRpcProtocol } from './core/protocol/json-rpc/json-rpc.protocol.js';
import { HttpTransport } from './core/transport/http/http.transport.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new WsAdapter(app));

  app.enableCors({
    origin: 'http://localhost:4200',
  });

  await app.listen(3000);

  const transport = app.get(HttpTransport);
  const protocol = new JsonRpcProtocol();

  const runtime = createRuntime({
    transport,
    protocol,
    providers: [
      {
        name: 'gemini',
        provider: new GeminiProvider(),
      },
    ],
    services: [],
  });

  bootstrapRuntime([new RuntimeInitializeApp()], runtime);

  console.log('StateFlowX runtime listening on ws://localhost:3000');
}

bootstrap();
