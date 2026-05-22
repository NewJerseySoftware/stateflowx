# @stateflowx/client

StateFlowX Client is a lightweight SDK for communicating with StateFlowX runtimes over pluggable transports such as JSON-RPC over HTTP and WebSockets.

## Features

- JSON-RPC client support
- HTTP transport support
- WebSocket transport support
- Transport abstraction
- Lightweight runtime connectivity
- Framework-agnostic architecture
- Runtime workflow execution
- Dynamic runtime initialization

## Installation

```bash
npm install @stateflowx/client
```

## Basic Example

```ts
import {
  createClient,
  defineConfig,
  jsonRpc,
  http,
} from '@stateflowx/client';

const config = defineConfig({
  protocol: jsonRpc(),

  transport: http({
    url: 'http://localhost:3000/rpc',
  }),
});

const client =
  createClient(config);

await client.connect();
```

## Websocket Example

```ts
import {
  createClient,
  defineConfig,
  jsonRpc,
  websocket,
} from '@stateflowx/client';

const config = defineConfig({
  protocol: jsonRpc(),

  transport: websocket({
    url: 'ws://localhost:3000',
  }),
});

const client =
  createClient(config);

await client.connect();
```

## Purpose

The client package is designed to communicate with StateFlowX runtimes while remaining transport-oriented and lightweight.

The architecture separates:

- transport
- protocol
- runtime execution
- workflow orchestration

allowing different runtime communication strategies without coupling the client to a specific delivery mechanism.

Current areas of focus include:

- Runtime workflow execution
- JSON-RPC communication
- Transport abstraction
- Realtime orchestration
- AI workflow interaction patterns

## Demo Application

Example Angular client implementation:

<https://github.com/bws9000/stateflowx-client-demo>

## Example Runtime Configuration

```ts
const config = defineConfig({
  protocol: jsonRpc(),

  transport: http({
    url: 'http://localhost:3000/rpc',
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

      prompt:
        'Format weather data into structured JSON',
    },
  ],
});
```

## Roadmap

- Additional protocol support
- Additional transport layers
- Runtime observability tooling
- Execution tracing
- Expanded workflow orchestration
- Provider fallback strategies
- Streaming execution support

## Related Demos

- React Client Demo:
  <https://github.com/bws9000/react-stateflowx-demo>

## Current Status

StateFlowX Client is currently experimental and under active development.
