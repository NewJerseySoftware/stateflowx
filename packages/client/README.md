# @stateflowx/client

StateFlowX Client is a lightweight SDK for communicating with StateFlowX runtimes over JSON-RPC and realtime WebSocket transports.

The client supports runtime workflow execution, realtime runtime events, and live orchestration observability.

---

## Features

- JSON-RPC client support
- WebSocket transport support
- Runtime event streaming
- Workflow lifecycle event support
- Realtime orchestration connectivity
- Transport abstraction
- Lightweight runtime connectivity
- Framework-agnostic architecture
- Runtime workflow execution
- Dynamic runtime initialization
- Realtime runtime observability foundation

---

## Installation

```bash
npm install @stateflowx/client
```

---

## Basic WebSocket Example

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

const client = createClient(config);

await client.connect();
```

---

## Runtime Event Streaming Example

```ts
client.onRuntimeEvent((event) => {
  console.log(
    '[RUNTIME EVENT]',
    event
  );
});
```

---

## Workflow Execution Example

```ts
await client.request(
  'runtime.initialize',
  config
);

const result =
  await client.request(
    'weather.execute'
  );
```

---

## Purpose

The client package is designed to communicate with StateFlowX runtimes while remaining lightweight, transport-oriented, and realtime-event capable.

The architecture separates:

- transport
- protocol
- runtime execution
- workflow orchestration
- runtime event streaming

allowing the client to remain decoupled from specific orchestration implementations.

Current areas of focus include:

- Runtime workflow execution
- JSON-RPC communication
- Realtime runtime events
- Workflow lifecycle observability
- Transport abstraction
- Realtime orchestration systems
- AI workflow interaction patterns

---

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

      url: 'mock://weather',
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

---

## Runtime Event Flow

```text
workflow.started
  ->
service.execute
  ->
provider.generate
  ->
workflow.completed
  ->
client runtime event stream
```

---

## Current Transport Support

StateFlowX Client V1 currently standardizes on:

- JSON-RPC
- WebSocket transport
- realtime runtime event streaming

Additional transport and protocol adapters may be explored in future releases.

---

## Demo Application

Example Angular client implementation:

<https://github.com/bws9000/stateflowx-client-demo>

---

## Roadmap

- Additional protocol support
- Additional transport layers
- Runtime observability tooling
- Execution tracing
- Expanded workflow orchestration
- Provider fallback strategies
- Service execution events
- Provider execution events
- Streaming execution support

---

## Related Demos

- React Client Demo:
  <https://github.com/bws9000/react-stateflowx-demo>

---

## Current Status

StateFlowX Client is currently experimental and under active development.
