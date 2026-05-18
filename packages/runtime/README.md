# @stateflowx/runtime

StateFlowX Runtime is a lightweight orchestration runtime for building operational workflows, realtime systems, and AI-driven execution pipelines using pluggable transports and providers.

## Features

- JSON-RPC over WebSockets
- Runtime composition
- Pluggable provider architecture
- Transport abstraction
- Service orchestration foundation
- Realtime execution flow
- NestJS-based runtime infrastructure

## Installation

```bash
npm install @stateflowx/runtime
```

## Basic Example

```ts
import { createRuntime } from '@stateflowx/runtime';

const runtime = createRuntime({
  providers: [
    gemini({
      priority: 1,
    }),
  ],
});

```

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

StateFlowX Runtime is currently experimental and under active development.
