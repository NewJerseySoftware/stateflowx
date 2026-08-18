# @stateflowx/runtime

StateFlowX Runtime is a lightweight execution engine for building AI-powered applications using configurable flows, pluggable providers, services, state stores, protocols, and transports.

Applications define flows composed of connected actions. The runtime executes them.

---

## Features

- Declarative flow configuration
- Dynamic flow registration
- Connector-based action composition
- Service actions
- AI provider actions
- Persistent store actions
- Pluggable AI providers
- Provider priority selection
- Pluggable service architecture
- Abstract asynchronous state store
- In-memory state storage
- MySQL state persistence
- JSON-RPC protocol
- HTTP transport
- WebSocket transport
- Runtime lifecycle management
- Runtime event streaming
- Multi-transport runtime architecture
- Realtime observability foundation
- Legacy workflow compatibility

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
- Flow execution

---

## Configurable Flows

A flow is composed of actions connected through outputs.

```ts
import {
  FlowConfig,
} from '@stateflowx/common';

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
            actionId:
              'weather-provider',
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

        outputConnectors: [
          {
            actionId:
              'weather-store',
          },
        ],
      },
      {
        id: 'weather-store',

        type: 'store',

        store: 'mysql',

        operation: 'set',

        key: 'weather:last-result',

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
MySQL store
      ↓
Flow result
```

Action results are passed through connectors. An action can consume the results of earlier connected actions and expose its result to later actions.

---

## Action Composition

StateFlowX currently supports three configurable action types:

- `service`
- `provider`
- `store`

Actions may be composed in different orders:

```text
Service → Provider → Store
Store → Service → Provider
Provider → Store → Service
Service → Store → Provider → Service
```

A service action can consume connected results:

```ts
{
  id: 'stored-result',

  type: 'store',

  store: 'mysql',

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

---

## Store Actions

Store actions provide database-independent state access.

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

  store: 'mysql',

  operation: 'set',

  key: 'analysis:last-result'
}
```

The value for a `set` operation is supplied by an input connector.

Runtime components interact only with the abstract store contract:

```ts
await runtime.store?.set(
  'analysis:last-result',
  result
);

const storedResult =
  await runtime.store?.get(
    'analysis:last-result'
  );
```

Flows do not contain database credentials or database-specific query logic.

---

## State Store Configuration

StateFlowX uses an in-memory store by default.

A runtime host can create a persistent MySQL store:

```ts
import {
  StoreFactory,
  createRuntime,
} from '@stateflowx/runtime';

const store =
  await StoreFactory.create({
    type: 'mysql',

    host:
      process.env.MYSQL_HOST ??
      'localhost',

    port: Number(
      process.env.MYSQL_PORT ??
      3306
    ),

    database:
      process.env.MYSQL_DATABASE ??
      'stateflowx',

    user:
      process.env.MYSQL_USER ??
      'root',

    password:
      process.env.MYSQL_PASSWORD ??
      '',

    table:
      process.env.MYSQL_TABLE ??
      'stateflowx_store',
  });

const runtime = createRuntime({
  transports,

  protocol,

  providers,

  services,

  store,
});
```

Example environment:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=stateflowx
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_TABLE=stateflowx_store
```

MySQL credentials belong to the runtime host environment and should not be sent from a browser client.

To disable runtime storage:

```ts
const runtime = createRuntime({
  transports,
  protocol,
  providers,
  services,
  store: false,
});
```

---

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

      url:
        'https://api.open-meteo.com/v1/forecast?..',
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
              actionId:
                'weather-provider',
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

          outputConnectors: [
            {
              actionId:
                'weather-store',
            },
          ],
        },
        {
          id: 'weather-store',

          type: 'store',

          store: 'mysql',

          operation: 'set',

          key: 'weather:last-result',

          output: true,
        },
      ],
    },
  ],
});
```

The runtime receives this configuration during initialization and dynamically registers services and flow routes.

---

## Provider Priority

Multiple providers may be registered with different priorities.

```ts
providers: [
  openai({ priority: 1 }),
  gemini({ priority: 2 }),
  mockProvider({ priority: 3 }),
]
```

If a provider action does not specify a provider, the runtime selects the highest-priority available provider.

An action may explicitly target a provider:

```ts
{
  id: 'weather-provider',

  type: 'provider',

  provider: 'gemini',

  prompt:
    'Summarize {{weather-service}}'
}
```

---

## Legacy Workflows

The earlier service-to-provider workflow configuration remains available for compatibility.

```ts
workflows: [
  {
    route: 'weather.execute',

    service: 'weather',

    provider: 'gemini',

    prompt:
      'Summarize the weather data.'
  }
]
```

New applications should prefer configurable `flows` and `actions`.

---

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

- Conditional execution
- Parallel execution
- Loop execution
- Retry and fallback configuration
- Additional state store implementations
- Execution persistence and recovery
- Streaming providers
- MCP server integration
- Execution tracing
- Runtime observability tooling

---

## Related Demos

React Client Demo:

<https://github.com/bws9000/react-stateflowx-demo>

Angular Client Demo:

<https://github.com/bws9000/stateflowx-client-demo>

Runtime Host Example:

<https://github.com/bws9000/stateflowx-runtime-host-example>

---

## Current Status

StateFlowX Runtime is experimental and under active development.
