# @stateflowx/runtime

StateFlowX Runtime is a lightweight execution engine for building AI-powered applications with configurable flows, pluggable providers and services, state storage, protocols, and transports.

Applications describe what should happen as a flow of connected actions. The runtime handles execution.

# Storage: In-memory by default

**No database setup is required. MySQL persistence is available. PostgreSQL and additional store implementations are coming soon.**

## Features

- Declarative flow configuration
- Dynamic flow registration
- Connector-based action composition
- Service, provider, and store actions
- Pluggable AI providers with priority selection
- Pluggable service architecture
- In-memory state storage by default
- Optional MySQL state persistence
- Database-independent store contract
- JSON-RPC protocol
- HTTP and WebSocket transports
- Runtime lifecycle management
- Runtime event streaming
- Multi-transport runtime architecture
- Realtime observability foundation
- Legacy workflow compatibility

## Installation

```bash
npm install @stateflowx/runtime
```

StateFlowX uses an in-memory store by default. Install the runtime and start executing flows without configuring a database.

## Runtime Host Example

Minimal external runtime host example:

<https://github.com/bws9000/stateflowx-runtime-host-example>

This demonstrates:

- External npm package consumption
- HTTP JSON-RPC hosting
- WebSocket JSON-RPC hosting
- Runtime initialization
- Runtime event streaming
- Provider registration
- Service registration
- Flow execution

## Configurable Flows

A flow is composed of actions connected through outputs.

```ts
import { FlowConfig } from '@stateflowx/common';

const flows: FlowConfig[] = [
  {
    name: 'Weather Analysis',
    route: 'weather.execute',
    actions: [
      {
        id: 'weather-service',
        type: 'service',
        service: 'weather',
        outputConnectors: [
          {
            actionId: 'weather-provider',
          },
        ],
      },
      {
        id: 'weather-provider',
        type: 'provider',
        provider: 'gemini',
        prompt: `
          Analyze the supplied weather data.

          Weather data:
          {{weather-service}}
        `,
        output: true,
      },
    ],
  },
];
```

This flow executes:

```text
Weather service
      ↓
Gemini provider
      ↓
Flow result
```

Action results are passed through connectors. An action can consume the results of earlier connected actions and expose its result to later actions.

## Action Composition

StateFlowX currently supports three configurable action types:

- `service`
- `provider`
- `store`

Actions can be composed in different orders:

```text
Service → Provider
Service → Provider → Store
Store → Service → Provider
Provider → Store → Service
```

A service action can consume a stored result:

```ts
{
  id: 'stored-result',
  type: 'store',
  operation: 'get',
  key: 'weather:last-result',
  outputConnectors: [
    {
      actionId: 'notification-service',
    },
  ],
},
{
  id: 'notification-service',
  type: 'service',
  service: 'notification',
  output: true,
}
```

For a single input connector, the connected result is passed directly to the service.

For multiple input connectors, the service receives an object keyed by source action ID.

## Store Actions

Store actions provide database-independent state access.

The runtime uses in-memory storage by default. Flow definitions do not need to identify or configure the underlying storage implementation.

Supported operations:

```text
get
set
delete
clear
```

Example:

```ts
{
  id: 'save-result',
  type: 'store',
  operation: 'set',
  key: 'analysis:last-result',
}
```

The value for a `set` operation is supplied by an input connector.

Runtime components interact only with the abstract store contract:

```ts
await runtime.store?.set(
  'analysis:last-result',
  result,
);

const storedResult = await runtime.store?.get(
  'analysis:last-result',
);
```

Flows do not contain database credentials or database-specific query logic.

## In-Memory Storage

No store configuration is required to use the default in-memory implementation:

```ts
const runtime = createRuntime({
  transports,
  protocol,
  providers,
  services,
});
```

The in-memory store is useful for:

- Getting started without database setup
- Local development
- Examples and demonstrations
- Automated tests
- Applications that do not require state to survive a runtime restart

MySQL persistence is also available when durable state is required. The runtime host owns the storage implementation and its credentials.

PostgreSQL and additional store implementations are planned.

To disable runtime storage entirely:

```ts
const runtime = createRuntime({
  transports,
  protocol,
  providers,
  services,
  store: false,
});
```

## Client Configuration

StateFlowX applications configure services, provider priorities, and flows declaratively.

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

  flows: [
    {
      name: 'Weather Analysis',
      route: 'weather.execute',
      actions: [
        {
          id: 'weather-service',
          type: 'service',
          service: 'weather',
          outputConnectors: [
            {
              actionId: 'weather-provider',
            },
          ],
        },
        {
          id: 'weather-provider',
          type: 'provider',
          provider: 'gemini',
          prompt: `
            Return only valid JSON.

            Analyze the supplied weather data:
            {{weather-service}}
          `,
          output: true,
        },
      ],
    },
  ],
});
```

The runtime receives this configuration during initialization and dynamically registers services and flow routes.

Browser clients do not configure database connections or receive database credentials.

## Provider Priority

Multiple providers can be registered with different priorities.

```ts
providers: [
  openai({ priority: 1 }),
  gemini({ priority: 2 }),
  mockProvider({ priority: 3 }),
]
```

If a provider action does not specify a provider, the runtime selects the highest-priority available provider.

An action can also explicitly target a provider:

```ts
{
  id: 'weather-provider',
  type: 'provider',
  provider: 'gemini',
  prompt: 'Summarize {{weather-service}}',
}
```

## Legacy Workflows

The earlier service-to-provider workflow configuration remains available for compatibility.

```ts
workflows: [
  {
    route: 'weather.execute',
    service: 'weather',
    provider: 'gemini',
    prompt: 'Summarize the weather data.',
  },
]
```

New applications should prefer configurable `flows` and `actions`.

## Runtime Event Flow

```text
runtime.initialize
        │
flow.started
        │
action.execute
        │
service / provider / store
        │
flow.completed
        │
runtime event stream
```

Runtime events can be consumed over WebSocket for realtime observability.

## Current Transport Support

StateFlowX Runtime currently supports:

- JSON-RPC
- HTTP transport
- WebSocket transport
- Runtime event streaming over WebSockets

## Roadmap

- Conditional execution
- Parallel execution
- Loop execution
- Retry and fallback configuration
- PostgreSQL store implementation
- Additional state store implementations
- Execution persistence and recovery
- Streaming providers
- MCP server integration
- Execution tracing
- Runtime observability tooling

## Related Demos

- React Client Demo: <https://github.com/bws9000/react-stateflowx-demo>
- Angular Client Demo: <https://github.com/bws9000/stateflowx-client-demo>
- Runtime Host Example: <https://github.com/bws9000/stateflowx-runtime-host-example>

## Current Status

StateFlowX Runtime is experimental and under active development.
