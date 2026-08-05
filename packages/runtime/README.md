# @stateflowx/runtime

StateFlowX Runtime is a lightweight execution engine for building AI-powered applications using configurable workflows, pluggable providers, services, protocols, and transports.

Applications define workflows. The runtime executes them.

---

## Features

- Configurable workflow execution
- Dynamic workflow registration
- Pluggable AI providers
- Provider priority selection
- Pluggable service architecture
- JSON-RPC protocol
- HTTP transport
- WebSocket transport
- Runtime lifecycle management
- Runtime event streaming
- Multi-transport runtime architecture
- Runtime composition
- Realtime observability foundation

---

## Installation

```bash
npm install @stateflowx/runtime
```

---

## Runtime Host Example

Minimal external runtime host example:

https://github.com/bws9000/stateflowx-runtime-host-example

This demonstrates:

- External npm package consumption
- HTTP JSON-RPC hosting
- WebSocket JSON-RPC hosting
- Runtime initialization
- Runtime event streaming
- Provider registration
- Service registration
- Workflow execution

---

## Client Configuration

StateFlowX applications configure the runtime using a declarative configuration object.

```ts
const config = defineConfig({

  protocol: jsonRpc(),

  transport: http({
    url: 'http://localhost:3000/rpc',
  }),

  providers: [
    openai({ priority: 1 }),
    gemini({ priority: 2 }),
    mockProvider({ priority: 3 }),
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

      prompt: `
        Summarize the supplied weather data.
      `,
    },
  ],
});
```

The runtime receives this configuration during initialization and dynamically registers providers, services, and workflows.

---

## Workflow Execution

A workflow describes *what* should execute.

```text
Client Request
       │
       ▼
weather.execute
       │
       ▼
Service
       │
       ▼
Provider
       │
       ▼
Result
```

Providers are selected automatically using configured priorities unless a workflow explicitly specifies one.

---

## Provider Priority

Multiple providers may be registered.

```ts
providers: [
  openai({ priority: 1 }),
  gemini({ priority: 2 }),
  mockProvider({ priority: 3 }),
]
```

If a workflow does not specify a provider, the runtime automatically selects the highest-priority provider.

A workflow may also explicitly target a provider.

```ts
workflows: [
  {
    route: 'weather.execute',

    service: 'weather',

    provider: 'gemini',

    prompt: '...'
  }
]
```

---

## Runtime Event Flow

```text
runtime.initialize
        │
workflow.started
        │
service.execute
        │
provider.generate
        │
workflow.completed
        │
Runtime event stream
```

Runtime events can be consumed over WebSocket for realtime observability.

---

## Current Transport Support

StateFlowX Runtime currently supports:

- JSON-RPC
- HTTP transport
- WebSocket transport
- Runtime event streaming over WebSockets

---

## Roadmap

- Configurable workflow actions
- Conditional execution
- Parallel execution
- Loop execution
- SQLite state store
- Additional state store implementations
- Execution persistence
- Streaming providers
- Execution tracing
- Runtime observability tooling

---

## Related Demos

React Client Demo

https://github.com/bws9000/react-stateflowx-demo

Angular Client Demo

https://github.com/bws9000/stateflowx-client-demo

---

## Current Status

StateFlowX Runtime is experimental and under active development.
