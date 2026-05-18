# @stateflowx/client

StateFlowX Client is a lightweight client SDK for communicating with StateFlowX runtimes over realtime transports such as JSON-RPC over WebSockets.

## Features

- JSON-RPC client support
- WebSocket transport integration
- Realtime communication
- Lightweight runtime connectivity
- Angular-compatible architecture
- Transport-oriented design

## Installation

```bash
npm install @stateflowx/client
```

## Basic Example

```ts
import { createClient } from '@stateflowx/client';

const client = createClient({
  url: 'ws://localhost:3000',
});

await client.connect();
```

## Purpose

The client package is designed to communicate with StateFlowX runtimes while remaining transport-oriented and lightweight. The architecture is intended to support future transport layers and operational workflow integrations beyond the current JSON-RPC/WebSocket implementation.


Current areas of focus include:

- Realtime runtime connectivity
- JSON-RPC transport communication
- Runtime interaction patterns
- Transport abstraction

## Roadmap

- Additional transport support
- REST-based transport experimentation
- Improved client lifecycle handling
- Expanded runtime communication patterns
- Observability and debugging tooling

## Demo Application

Example Angular client implementation:

https://github.com/bws9000/stateflowx-client-demo

## Example Runtime Configuration

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

## Current Status

StateFlowX Client is currently experimental and under active development.
