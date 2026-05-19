# @stateflowx/runtime

StateFlowX Runtime is a lightweight orchestration runtime for building operational workflows, realtime systems, and AI-driven execution pipelines using pluggable transports and providers.

## Features

- JSON-RPC over WebSockets
- Runtime composition
- Pluggable provider architecture
- Transport abstraction
- Dynamic workflow registration
- Service orchestration foundation
- Realtime execution flow
- NestJS-based runtime infrastructure

---

## Installation

```bash
npm install @stateflowx/runtime
```

---

## Runtime Host Example

Minimal external runtime host example:

<https://github.com/bws9000/stateflowx-runtime-host-example>

This demonstrates:

- external npm package consumption
- WebSocket runtime hosting
- JSON-RPC transport
- dynamic runtime initialization
- Gemini provider integration
- remote workflow execution

---

## Demo Client Application

Example Angular client implementation:

<https://github.com/bws9000/stateflowx-client-demo>

## Demo Host Application

<https://github.com/bws9000/stateflowx-runtime-host-example>

---

## Basic Runtime Host Example

```ts
import 'dotenv/config';

import { WebSocketServer } from 'ws';

import {
  createRuntime,
  RuntimeInitializeApp,
  GeminiProvider,
} from '@stateflowx/runtime';

const wss = new WebSocketServer({
  port: 3000,
});

wss.on('connection', (socket) => {
  const runtime = createRuntime(
    {
      send(data) {
        socket.send(data);
      },
    },
    {
      apps: [
        new RuntimeInitializeApp(),
      ],

      providers: [
        {
          name: 'default',
          provider: new GeminiProvider(),
        },
      ],

      services: [],
    }
  );

  socket.on('message', async (message) => {
    const payload = JSON.parse(message.toString());

    await runtime.receiveAndSend(payload);
  });
});

console.log(
  'StateFlowX runtime listening on ws://localhost:3000'
);
```

---

## Example Client Runtime Configuration

```ts
const config = defineConfig({
  protocol: jsonRpc(),

  transport: websocket({
    url: 'ws://localhost:3000',
  }),

  providers: [
    gemini({
      priority: 1,
    }),

    mockProvider({
      priority: 2,
    }),
  ],

  services: [
    {
      name: 'weather',
      type: 'http',
      method: 'GET',
      url: 'https://api.open-meteo.com/v1/forecast?...',
    },
  ],

  workflows: [
    {
      route: 'weather.execute',
      service: 'weather',
      provider: 'default',
      prompt: 'Format weather data into structured JSON',
    },
  ],
});
```

---

## Architecture

```text
Angular Client
  ->
WebSocket
  ->
JSON-RPC Runtime
  ->
Dynamic Runtime Initialization
  ->
Workflow Registration
  ->
HTTP Services
  ->
AI Providers
  ->
Structured Response
```

---

## Current Status

StateFlowX Runtime is currently experimental and under active development.
