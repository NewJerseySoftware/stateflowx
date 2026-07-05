# @stateflowx/client

StateFlowX Client is a lightweight SDK for communicating with StateFlowX runtimes over JSON-RPC using configurable HTTP and WebSocket transports.

The client supports runtime workflow execution, optional realtime runtime events, and transport-independent orchestration.

---

## Features

- JSON-RPC client support
- HTTP transport support
- WebSocket transport support
- Runtime workflow execution
- Optional runtime event streaming
- Runtime lifecycle support
- Transport abstraction
- Framework-agnostic architecture
- Dynamic runtime initialization

---

## Installation

```bash
npm install @stateflowx/client
```

---

## Basic Example

```ts
const config = defineConfig({
  protocol: jsonRpc(),

  transport: http({
    url: 'http://localhost:3000/rpc',
  }),
});
```

## WebSocket Example

```ts
const config = defineConfig({
  protocol: jsonRpc(),

  transport: websocket({
    url: 'ws://localhost:3001',
  }),
});
```

---

## Runtime Event Streaming Example

Runtime event streaming is available when using the WebSocket transport.

```ts
client.onRuntimeEvent((event) => {
  console.log('[RUNTIME EVENT]', event);
});
```

---

## Workflow Execution Example

```ts
await client.request('runtime.initialize', config);

const result = await client.request('weather.execute');
```

---

## Purpose

The StateFlowX Client provides a lightweight, transport-independent API for communicating with StateFlowX runtimes.

The architecture separates:

- transport
- protocol
- runtime execution
- workflow orchestration
- runtime event streaming

allowing applications to communicate with the runtime over different transports while remaining decoupled from workflow execution and orchestration details.

Current areas of focus include:

- Runtime workflow execution
- JSON-RPC communication
- HTTP and WebSocket transports
- Realtime runtime event streaming
- Workflow lifecycle observability
- Transport abstraction
- AI workflow interaction

---

## Example Runtime Configuration

```ts
const config = defineConfig({
  protocol: jsonRpc(),

  transport: websocket({
    url: 'ws://localhost:3001',
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

      prompt: 'Format weather data into structured JSON',
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

StateFlowX Client currently supports:

- JSON-RPC protocol
- HTTP transport
- WebSocket transport
- Realtime runtime event streaming over WebSockets

Additional transport and protocol adapters may be explored in future releases.

---

## Demo Application

Example Angular client implementation:

<https://github.com/bws9000/stateflowx-client-demo>

---

## Roadmap

- Additional protocol support
- Runtime observability tooling
- Execution tracing
- Streaming execution support
- Expanded workflow orchestration
- Provider fallback strategies
- Artifact generation
- Database persistence
- Distributed runtime support

---

## Related Demos

- React Client Demo:
  <https://github.com/bws9000/react-stateflowx-demo>

---

## Current Status

StateFlowX Client is currently experimental and under active development.
